import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/my"
        );
        setOrders(data);
      } catch (error) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // AUTH LOADING
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-600 rounded-full"></div>
      </div>
    );
  }

  // NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 className="text-xl font-semibold">Login to view orders</h2>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin h-10 w-10 border-b-2 border-purple-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-5xl">

        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          My Orders
        </h1>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <Link to="/">
              <button className="mt-3 px-5 py-2 bg-purple-500 text-white rounded">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-white p-4 sm:p-5 rounded-xl shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >

                {/* TOP */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  
                  <div>
                    <h3 className="font-bold text-lg">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <span className="font-bold text-sm sm:text-base">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                          {item.productId?.image && (
                            <img
                              src={item.productId.image}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs sm:text-sm">
                        <p>Qty: {item.qty}</p>
                        <p className="font-semibold">
                          ₹{item.price * item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADDRESS */}
                <div className="border-t pt-3 text-sm">
                  <p className="text-gray-600">
                    📍 {order.address}
                  </p>
                  <p className="text-gray-600">
                    📞 {order.phone}
                  </p>
                </div>

              </motion.div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;