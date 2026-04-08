import { useCart } from "../context/CartContext";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(product.weights?.length > 0 ? product.weights[0] : null);

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      selectedWeight: selectedWeight,
      finalPrice: selectedWeight ? selectedWeight.price : product.price
    };
    addToCart(cartProduct);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">
      
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            🍰
          </div>
        )}

        {/* Category */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs bg-black/70 text-white rounded-full">
          {product.category || "Bakery"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-gray-900 font-semibold text-lg mb-1 line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-shrink-0">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mb-3">
          {product.weights && product.weights.length > 0 && selectedWeight ? (
            <div>
              <span className="text-lg font-bold text-black">
                ₹{selectedWeight.price}
              </span>
              <span className="text-xs text-gray-500 block">
                {selectedWeight.label}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-black">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Weight Selector for Products with Weights */}
        {product.weights && product.weights.length > 0 && (
          <div className="mb-3">
            <label className="text-sm text-gray-600 mb-1 block">Select Weight:</label>
            <select
              value={selectedWeight?.label || ''}
              onChange={(e) => {
                const weight = product.weights.find(w => w.label === e.target.value);
                setSelectedWeight(weight);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {product.weights.map((weight) => (
                <option key={weight.label} value={weight.label}>
                  {weight.label} - ₹{weight.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition mt-auto"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;