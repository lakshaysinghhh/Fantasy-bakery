import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    case "STOP_LOADING":
      return { ...state, loading: false };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { ...user, token },
        });
      } catch {
        localStorage.clear();
        dispatch({ type: "STOP_LOADING" });
      }
    } else {
      dispatch({ type: "STOP_LOADING" });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);