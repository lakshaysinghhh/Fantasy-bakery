import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import ModernLogin from "./pages/ModernLogin";
import ModernRegister from "./pages/ModernRegister";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // ✅ ADD THIS

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>

          {/*  SCROLL FIX */}
          <ScrollToTop />

          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow mt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<ModernLogin />} />
                <Route path="/register" element={<ModernRegister />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>

            <Footer />
          </div>

        </BrowserRouter>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
              color: '#fff',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;