import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, weights } = req.body;

    // Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Please provide name, price, and category" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    const image = req.file
      ? req.file.path
      : req.body.image
      ? req.body.image
      : "https://dummyimage.com/300x300/cccccc/000000&text=No+Image";

    const product = new Product({
      name,
      price,
      image,
      category,
      description,
      weights: weights ? JSON.parse(weights) : [],
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("ADD ERROR:", error); // 🔥 important
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 only delete if image exists
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`bakery/${publicId}`);
    }

    await product.deleteOne();

    res.json({ message: "Product removed" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};