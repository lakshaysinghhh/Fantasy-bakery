import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// public
router.get("/", getProducts);

// admin only
router.post("/", protect, admin, upload.single("image"), addProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;