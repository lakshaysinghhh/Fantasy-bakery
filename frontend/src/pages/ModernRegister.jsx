import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showLoading } from "../utils/toast";

const ModernRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      showError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      showSuccess("Account created 🎉");
      navigate("/");
    } catch (err) {
      showError(err || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">

      <div className="hidden lg:flex flex-col justify-center items-center bg-black text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Fantasy Bakery</h1>
        <p className="text-gray-300 text-center max-w-md">
          Create account & enjoy delicious treats 🍰
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border"
        >
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">Get started</p>

          <form onSubmit={submit} className="space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2.5 border rounded-lg"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2.5 border rounded-lg"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2.5 border rounded-lg"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button className="w-full py-3 bg-black text-white rounded-lg">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernRegister;