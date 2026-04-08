import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { showSuccess, showError, showLoading, showPromise } from "../utils/toast";

const Admin = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
    weights: [],
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    if (!isAuthenticated || !user?.isAdmin) return navigate("/");
    fetchProducts();
    fetchOrders();
    fetchArchivedOrders();
  }, [authLoading, isAuthenticated, user?.isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch {
      showError("Products fetch failed");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders");
      setOrders(data);
    } catch {
      showError("Orders fetch failed");
    }
  };

  const fetchArchivedOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders/archived");
      setArchivedOrders(data);
    } catch {}
  };

  // IMAGE HANDLER
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return showError("Only image allowed");
    if (file.size > 5 * 1024 * 1024) return showError("Max 5MB");

    setForm({ ...form, image: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ADD PRODUCT
  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      return showError("Fill required fields");
    }

    // Validate weights if present
    if (form.weights.length > 0) {
      const invalidWeights = form.weights.filter(w => !w.label || !w.price);
      if (invalidWeights.length > 0) {
        return showError("Please fill both label and price for all weight options");
      }
    }

    setLoading(true);
    showLoading("Adding...");

    try {
      const fd = new FormData();
      
      // Handle basic fields
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('description', form.description);
      
      // Handle weights
      if (form.weights.length > 0) {
        console.log("Sending weights:", form.weights);
        fd.append('weights', JSON.stringify(form.weights));
      }
      
      // Handle image
      if (form.image) {
        fd.append('image', form.image);
      }

      // Debug FormData
      console.log("FormData contents:");
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      await axios.post("http://localhost:5000/api/products", fd);

      showSuccess("Product added");
      setForm({ 
        name: "", 
        price: "", 
        category: "", 
        description: "", 
        image: null,
        weights: [],
      });
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      console.error("Product add error:", error.response?.data || error);
      showError(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = (id) => {
    const promise = axios.delete(`http://localhost:5000/api/products/${id}`);
    showPromise(promise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Error",
    }).then(fetchProducts);
  };

  const updateOrderStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
    fetchOrders();
  };

  const archiveOrder = async (id) => {
    await axios.put(`http://localhost:5000/api/orders/${id}/archive`);
    fetchOrders();
    fetchArchivedOrders();
  };

  const restoreOrder = async (id) => {
    await axios.put(`http://localhost:5000/api/orders/${id}/restore`);
    fetchOrders();
    fetchArchivedOrders();
  };

  // AUTH LOADING
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-b-2 border-black rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto mb-6 flex gap-3">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "products" ? "bg-black text-white" : "bg-white border"
          }`}
        >
          Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "orders" ? "bg-black text-white" : "bg-white border"
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* PRODUCTS */}
      {activeTab === "products" && (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">

          {/* FORM */}
          <form onSubmit={submit} className="bg-white p-5 rounded-xl shadow space-y-4">
            <h2 className="font-semibold">Add Product</h2>

            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="input"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Category</option>
              <option>Cake</option>
              <option>Pastry</option>
              <option>Cookie</option>
            </select>

            <textarea
              className="input"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* Weight Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Weight Options (Optional)</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, weights: [...form.weights, { label: "", price: "" }] })}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  + Add Weight
                </button>
              </div>

              {form.weights.map((weight, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    className="input flex-1"
                    placeholder="e.g., 500g, 1kg"
                    value={weight.label}
                    onChange={(e) => {
                      const newWeights = [...form.weights];
                      newWeights[index].label = e.target.value;
                      setForm({ ...form, weights: newWeights });
                    }}
                  />
                  <input
                    className="input w-24"
                    placeholder="Price"
                    type="number"
                    value={weight.price}
                    onChange={(e) => {
                      const newWeights = [...form.weights];
                      newWeights[index].price = e.target.value;
                      setForm({ ...form, weights: newWeights });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newWeights = form.weights.filter((_, i) => i !== index);
                      setForm({ ...form, weights: newWeights });
                    }}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* IMAGE */}
            <input type="file" onChange={handleImageChange} className="text-sm" />

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            <button className="w-full bg-black text-white py-2 rounded">
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>

          {/* PRODUCT LIST */}
          <div className="bg-white p-5 rounded-xl shadow max-h-[500px] overflow-y-auto space-y-3">
            {products.map((p) => (
              <div key={p._id} className="flex justify-between items-center border p-2 rounded">
                <span>{p.name}</span>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS */}
      {activeTab === "orders" && (
        <div className="max-w-7xl mx-auto">

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              Show archived
            </label>
          </div>

          <div className="bg-white p-5 rounded-xl shadow space-y-4 max-h-[600px] overflow-y-auto">
            {(showArchived ? archivedOrders : orders).map((o) => (
              <div key={o._id} className="border p-3 rounded-lg">

                <div className="flex justify-between mb-2">
                  <span className="font-medium">#{o._id.slice(-6)}</span>
                  <span>₹{o.totalAmount}</span>
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  {o.user?.name} • {o.user?.email}
                </div>

                <div className="flex gap-2 mb-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    className="border px-2 py-1 text-sm rounded"
                  >
                    <option>pending</option>
                    <option>confirmed</option>
                    <option>delivered</option>
                  </select>

                  <button
                    onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}
                    className="text-blue-500 text-sm hover:text-blue-700"
                  >
                    {expandedOrder === o._id ? "Hide Details" : "View Details"}
                  </button>

                  {showArchived ? (
                    <button onClick={() => restoreOrder(o._id)} className="text-blue-500 text-sm">
                      Restore
                    </button>
                  ) : (
                    <button onClick={() => archiveOrder(o._id)} className="text-orange-500 text-sm">
                      Archive
                    </button>
                  )}
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === o._id && (
                  <div className="mt-3 pt-3 border-t bg-gray-50 p-3 rounded">
                    <div className="space-y-2">
                      <div className="font-semibold text-sm">Order Items:</div>
                      {o.items?.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm bg-white p-2 rounded">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            {item.selectedWeight && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({item.selectedWeight.label})
                              </span>
                            )}
                            <span className="text-gray-500 ml-2">x{item.qty}</span>
                          </div>
                          <span className="font-medium">₹{item.price}</span>
                        </div>
                      ))}
                      
                      <div className="pt-2 mt-2 border-t">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{(o.totalAmount / 1.05).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax (5%):</span>
                            <span>₹{((o.totalAmount / 1.05) * 0.05).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>₹{o.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t text-sm">
                        <div className="font-semibold mb-1">Customer Details:</div>
                        <div className="text-gray-600 space-y-1">
                          <div><strong>Name:</strong> {o.user?.name}</div>
                          <div><strong>Email:</strong> {o.user?.email}</div>
                          <div><strong>Phone:</strong> {o.phone}</div>
                          <div><strong>Address:</strong> {o.address}</div>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t text-sm">
                        <div className="font-semibold mb-1">Order Info:</div>
                        <div className="text-gray-600 space-y-1">
                          <div><strong>Order ID:</strong> #{o._id}</div>
                          <div><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${
                            o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            o.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>{o.status}</span></div>
                          <div><strong>Date:</strong> {new Date(o.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;