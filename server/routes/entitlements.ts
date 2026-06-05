import { Router, Request, Response } from "express";
import Entitlement from "../../models/Entitlement";
import { requireAdmin } from "../security";

const router = Router();

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.status === "string" && req.query.status !== "all") filter.status = req.query.status;
    if (typeof req.query.productId === "string" && req.query.productId) filter.productId = req.query.productId;
    if (typeof req.query.customerEmail === "string" && req.query.customerEmail) {
      filter.customerEmail = req.query.customerEmail.toLowerCase().trim();
    }

    const entitlements = await Entitlement.find(filter)
      .populate("productId", "title slug")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(entitlements);
  } catch {
    res.status(500).json({ error: "Failed to fetch entitlements" });
  }
});

router.patch("/:id/revoke", requireAdmin, async (req: Request, res: Response) => {
  try {
    const entitlement = await Entitlement.findByIdAndUpdate(
      req.params.id,
      { status: "revoked" },
      { new: true }
    );
    if (!entitlement) {
      res.status(404).json({ error: "Entitlement not found" });
      return;
    }
    res.json(entitlement);
  } catch {
    res.status(500).json({ error: "Failed to revoke entitlement" });
  }
});

export default router;
