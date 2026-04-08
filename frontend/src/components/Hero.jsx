import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <span className="inline-block mb-4 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
            Fresh • Handmade • Delivered
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
            Delicious Cakes <br />
            <span className="text-gray-400">Made for Every Moment</span>
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Order freshly baked cakes crafted with love. Perfect for birthdays,
            celebrations, or just to treat yourself.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition"
            >
              Order Now
            </Link>

            <button
              onClick={() => {
                const element = document.getElementById("products");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Explore Menu
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-2xl font-bold text-gray-900">5000+</p>
              <p className="text-sm text-gray-500">Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">100+</p>
              <p className="text-sm text-gray-500">Cake Varieties</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8★</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <img
            src="https://media.istockphoto.com/id/1053587888/photo/pastel-cupcake-background-in-green-and-pink.webp?a=1&b=1&s=612x612&w=0&k=20&c=8sPlPywWu9O2gocmgZDlveHKeMKomqTO1sxsXG2Oubs="
            alt="Cake"
            className="rounded-3xl shadow-xl w-full object-cover"
          />

          {/* subtle floating badge */}
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-md text-sm">
            🎂 Freshly Baked Daily
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;