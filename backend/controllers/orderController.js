import Order from "../models/Order.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, address, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!address || !phone) {
      return res.status(400).json({ message: "Address and phone are required" });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
      });

      totalAmount += product.price * item.qty;
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      address,
      phone,
    });

    // Update user address and phone if provided
    await User.findByIdAndUpdate(req.user._id, {
      address,
      phone,
    });

    const populatedOrder = await Order.findById(order._id).populate("user", "name email");

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, isDeleted: false })
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get User Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("user", "name email")
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ _id: req.params.id, isDeleted: false });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.productId", "name image");

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Archive order (admin)
// @route   PUT /api/orders/:id/archive
// @access  Private/Admin
export const archiveOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, isDeleted: false });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDeleted = true;
    await order.save();

    res.json({ message: "Order archived successfully" });
  } catch (error) {
    console.error("Archive Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all archived orders (admin)
// @route   GET /api/orders/archived
// @access  Private/Admin
export const getArchivedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: true })
      .populate("user", "name email")
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get Archived Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Restore order (admin)
// @route   PUT /api/orders/:id/restore
// @access  Private/Admin
export const restoreOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, isDeleted: true });

    if (!order) {
      return res.status(404).json({ message: "Archived order not found" });
    }

    order.isDeleted = false;
    await order.save();

    const restoredOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.productId", "name image");

    res.json(restoredOrder);
  } catch (error) {
    console.error("Restore Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
