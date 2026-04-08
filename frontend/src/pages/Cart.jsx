import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const { items, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    setShowCheckoutForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      toast.error("Fill all details");
      return;
    }

    setIsCheckingOut(true);
    try {
      await axios.post("http://localhost:5000/api/orders", {
        items: items.map((i) => ({
          productId: i._id,
          name: i.name,
          qty: i.quantity,
          price: i.finalPrice || i.price,
          selectedWeight: i.selectedWeight ? {
            label: i.selectedWeight.label,
            price: i.selectedWeight.price
          } : undefined
        })),
        address,
        phone,
      });

      toast.success("Order placed!");
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      toast.error("Failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center p-6">
          <div className="text-6xl sm:text-7xl mb-4">🛒</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Cart is empty</h2>
          <Link to="/">
            <button className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-5xl">

        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          🛒 Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Items ({items.length})</h2>
              <button onClick={clearCart} className="text-red-500 text-sm">
                Clear
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* IMAGE */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.finalPrice || item.price}
                      {item.selectedWeight && (
                        <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {item.selectedWeight.label}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex justify-between sm:justify-end items-center gap-3 w-full sm:w-auto">
                    
                    {/* QTY */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 border rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 border rounded"
                      >
                        +
                      </button>
                    </div>

                    {/* PRICE */}
                    <div className="font-bold">
                      ₹{(item.finalPrice || item.price) * item.quantity}
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-5 rounded-xl shadow lg:sticky lg:top-6">
            <h2 className="font-bold mb-4">Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
              </div>

              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>₹{(totalAmount * 1.05).toFixed(2)}</span>
              </div>
            </div>

            {!showCheckoutForm ? (
              <button
                onClick={handleCheckout}
                className="w-full mt-4 py-3 bg-yellow-500 text-white rounded-lg"
              >
                Checkout
              </button>
            ) : (
              <div className="mt-4 space-y-3">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full border p-2 rounded text-sm"
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full border p-2 rounded text-sm"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="w-1/2 bg-gray-200 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-1/2 bg-yellow-500 text-white py-2 rounded"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "..." : "Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;