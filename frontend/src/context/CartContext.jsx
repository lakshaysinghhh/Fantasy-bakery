import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

const calculateTotal = (items) => {
  return items.reduce(
    (total, item) => {
      const itemPrice = item.selectedWeight 
        ? item.selectedWeight.price 
        : (item.finalPrice || item.price || 0);
      return total + itemPrice * (item.quantity || 1);
    },
    0
  );
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          { ...action.payload, quantity: 1 },
        ];
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case "REMOVE_FROM_CART": {
      const filteredItems = state.items.filter(
        (item) => item._id !== action.payload
      );

      return {
        ...state,
        items: filteredItems,
        totalAmount: calculateTotal(filteredItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        );

      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case "CLEAR_CART":
      return { items: [], totalAmount: 0 };

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload || [],
        totalAmount: calculateTotal(action.payload || []),
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalAmount: 0,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && Array.isArray(parsedCart)) {
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        }
      }
    } catch (err) {
      console.error("Cart parse error:", err);
      localStorage.removeItem("cart"); // Clear corrupted data
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (state.items && state.items.length > 0) {
        localStorage.setItem("cart", JSON.stringify(state.items));
      } else {
        localStorage.removeItem("cart"); // Clear if cart is empty
      }
    } catch (err) {
      console.error("Cart save error:", err);
    }
  }, [state.items, state.totalAmount]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    toast.success("Item removed");
  };

  const updateQuantity = (id, qty) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: qty } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };

  const getCartItemCount = () =>
    state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);