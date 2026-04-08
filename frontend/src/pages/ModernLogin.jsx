import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showLoading } from "../utils/toast";

const ModernLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      showError("Please fill in all fields");
      return;
    }

    setLoading(true);
    showLoading("Logging in...");

    try {
      await login(form.email, form.password);
      showSuccess("Welcome back 🎉");
      navigate("/");
    } catch (err) {
      showError(err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">

      {/* LEFT */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-black text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Fantasy Bakery</h1>
        <p className="text-gray-300 text-center max-w-md">
          Welcome back! Login to continue 🍰
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Login to your account</p>

          <form onSubmit={submit} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button className="w-full py-3 bg-black text-white rounded-lg">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLogin;