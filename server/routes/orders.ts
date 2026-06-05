import { Router, Request, Response } from "express";
import Order from "../../models/Order";
import { requireAdmin } from "../security";

const router = Router();

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const filter = typeof req.query.status === "string" && req.query.status !== "all"
      ? { status: req.query.status }
      : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
