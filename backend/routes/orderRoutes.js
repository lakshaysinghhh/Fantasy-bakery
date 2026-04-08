import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  archiveOrder,
  restoreOrder,
  getArchivedOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createOrder);
router.get("/my", getUserOrders);

// Admin only routes
router.use(admin);
router.get("/", getAllOrders);
router.get("/archived", getArchivedOrders);
router.put("/:id", updateOrderStatus);
router.put("/:id/archive", archiveOrder);
router.put("/:id/restore", restoreOrder);

export default router;