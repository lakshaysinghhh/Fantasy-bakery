import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// __dirname fix (ES module me)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS (production ready)
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allowed origins for development and production
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://fantasy-bakery.onrender.com'
    ];
    
    if (process.env.CLIENT_URL) {
      allowedOrigins.push(process.env.CLIENT_URL);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Production: frontend serve karna
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Running...");
  });
}

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      // Server running on ${PORT}
    });

  } catch (error) {
    console.error("❌ Server start error:", error.message);
  }
};

startServer();