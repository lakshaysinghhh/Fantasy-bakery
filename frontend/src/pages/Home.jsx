import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeFilter));
    }
  }, [products, activeFilter]);

  
  // ✅ LOADING UI (clean)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      
      {/* HERO */}
      <Hero />

      {/* FEATURES */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            Premium bakery experience crafted with quality ingredients and modern techniques.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Premium Quality",
                desc: "Fresh ingredients with top-notch quality control.",
                icon: "🥇",
              },
              {
                title: "Fast Delivery",
                desc: "Quick and reliable delivery at your doorstep.",
                icon: "🚚",
              },
              {
                title: "Custom Orders",
                desc: "Personalized cakes for every occasion.",
                icon: "🎂",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Our Products
              </h2>
              <p className="text-gray-500 text-sm">
                Freshly baked delights just for you
              </p>
            </div>

            {/* Filter UI */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Cake", "Pastry", "Cookie"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 text-sm rounded-full border transition ${
                    activeFilter === cat 
                      ? "bg-black text-white border-black" 
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No products available for {activeFilter.toLowerCase()}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            About Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are a modern bakery focused on delivering high-quality baked goods
            with a blend of traditional recipes and modern techniques. Our mission
            is to bring happiness through every bite.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-10">
            Have questions or want to place a custom order?
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold">📍 Address</p>
              <p className="text-gray-400">Delhi, India</p>
            </div>
            <div>
              <p className="font-semibold">📞 Phone</p>
              <p className="text-gray-400">+91 99999 99999</p>
            </div>
            <div>
              <p className="font-semibold">✉️ Email</p>
              <p className="text-gray-400">info@bakery.com</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;