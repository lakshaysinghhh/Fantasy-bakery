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
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

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