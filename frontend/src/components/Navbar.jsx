import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { showSuccess } from "../utils/toast";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = getCartItemCount();

  const handleLogout = async () => {
    await logout();
    showSuccess("Logged out successfully! See you soon! ");
    navigate("/");
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsMobileMenuOpen(false);
  };

  const navigateToHome = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={navigateToHome}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center">
              🧁
            </div>
            <div className="text-left">
              <span className="text-lg font-semibold text-gray-900">
                Fantasy Bakery
              </span>
              <p className="text-xs text-gray-500 hidden sm:block">
                Sweet moments
              </p>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">

            <button onClick={() => scrollToSection("products")} className="nav-link">
              Products
            </button>
            <button onClick={() => scrollToSection("about")} className="nav-link">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="nav-link">
              Contact
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <span className="text-gray-700 text-lg">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>

                {user?.isAdmin && (
                  <Link to="/admin" className="btn-primary">
                    Admin
                  </Link>
                )}

                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-md z-40 lg:hidden">
          <div className="px-4 py-4 flex flex-col gap-4">

            <button onClick={() => scrollToSection("products")} className="mobile-link">
              Products
            </button>
            <button onClick={() => scrollToSection("about")} className="mobile-link">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="mobile-link">
              Contact
            </button>

            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">
              Cart ({cartItemCount})
            </Link>

            {isAuthenticated ? (
              <>
                {user?.isAdmin && (
                  <Link to="/admin" className="btn-primary text-center">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-center">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-center">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;