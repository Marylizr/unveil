import { Router, Request, Response } from "express";
import { requireAdmin, rateLimit } from "../security";
import {
  createLeadMagnet,
  deleteLeadMagnet,
  getLeadMagnetBySlug,
  getAdminLeadMagnetById,
  listAdminLeadMagnets,
  listLeadMagnets,
  setLeadMagnetPublished,
  updateLeadMagnet,
} from "../services/leadMagnetService";
import { validateLeadMagnetInput } from "../validators/leadMagnetValidator";
import { getLeadMagnetDownload } from "../services/leadService";
import { validateTokenInput } from "../validators/leadValidator";

const router = Router();

router.get("/admin/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json(await listAdminLeadMagnets());
  } catch {
    res.status(500).json({ error: "Failed to fetch admin lead magnets" });
  }
});

router.get("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const leadMagnet = await getAdminLeadMagnetById(req.params.id);
    if (!leadMagnet) {
      res.status(404).json({ error: "Lead magnet not found" });
      return;
    }
    res.json(leadMagnet);
  } catch {
    res.status(500).json({ error: "Failed to fetch admin lead magnet" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json(await listLeadMagnets());
  } catch {
    res.status(500).json({ error: "Failed to fetch lead magnets" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const leadMagnet = await getLeadMagnetBySlug(req.params.slug);
    if (!leadMagnet) {
      res.status(404).json({ error: "Lead magnet not found" });
      return;
    }
    res.json(leadMagnet);
  } catch {
    res.status(500).json({ error: "Failed to fetch lead magnet" });
  }
});

router.get("/:slug/download", rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateTokenInput(req.query.token);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const result = await getLeadMagnetDownload(req.params.slug, validated.value.token);
    if (result.status !== "ready") {
      res.status(403).json({ error: "Download link is invalid or expired" });
      return;
    }

    res.json({ pdfUrl: result.pdfUrl });
  } catch {
    res.status(500).json({ error: "Failed to prepare download" });
  }
});

router.post("/", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateLeadMagnetInput(req.body);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }
    res.status(201).json(await createLeadMagnet(validated.value));
  } catch {
    res.status(400).json({ error: "Failed to create lead magnet" });
  }
});

router.put("/:id", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateLeadMagnetInput(req.body, true);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const leadMagnet = await updateLeadMagnet(req.params.id, validated.value);
    if (!leadMagnet) {
      res.status(404).json({ error: "Lead magnet not found" });
      return;
    }
    res.json(leadMagnet);
  } catch {
    res.status(400).json({ error: "Failed to update lead magnet" });
  }
});

router.delete("/:id", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const leadMagnet = await deleteLeadMagnet(req.params.id);
    if (!leadMagnet) {
      res.status(404).json({ error: "Lead magnet not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Failed to delete lead magnet" });
  }
});

router.patch("/:id/publish", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const leadMagnet = await setLeadMagnetPublished(req.params.id, req.body.isPublished === true);
    if (!leadMagnet) {
      res.status(404).json({ error: "Lead magnet not found" });
      return;
    }
    res.json(leadMagnet);
  } catch {
    res.status(400).json({ error: "Failed to publish lead magnet" });
  }
});

export default router;
