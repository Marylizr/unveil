import { Router, Request, Response } from "express";
import { rateLimit, requireAdmin } from "../security";
import { confirmLead, createLead, listLeads, unsubscribeLead } from "../services/leadService";
import { processDueEmailSequences, trackingPixel, trackSequenceClick, trackSequenceOpen } from "../services/emailSequenceService";
import { validateLeadInput, validateTokenInput } from "../validators/leadValidator";
import { getAppUrl } from "../email";

const router = Router();

router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json(await listLeads());
  } catch {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

router.post("/", rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateLeadInput(req.body);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const result = await createLead(validated.value, {
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    });
    res.status(202).json({
      message: "Please check your email to confirm your subscription.",
      status: result.status,
    });
  } catch {
    res.status(500).json({ error: "Failed to create lead" });
  }
});

router.post("/sequence/process", requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json(await processDueEmailSequences());
  } catch {
    res.status(500).json({ error: "Failed to process email sequence" });
  }
});

router.get("/sequence/open/:token.gif", async (req: Request, res: Response) => {
  await trackSequenceOpen(req.params.token).catch(() => false);
  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(trackingPixel());
});

router.get("/sequence/click/:token", async (req: Request, res: Response) => {
  await trackSequenceClick(req.params.token).catch(() => false);
  const fallback = `${getAppUrl()}/learn`;
  const target = typeof req.query.url === "string" ? req.query.url : fallback;
  const appUrl = getAppUrl();
  const safeTarget = target.startsWith(appUrl) || target.startsWith("/") ? target : fallback;
  res.redirect(safeTarget);
});

router.get("/confirm", rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateTokenInput(req.query.token);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const result = await confirmLead(validated.value.token);
    if (result.status === "invalid") {
      res.status(400).json({ error: "Confirmation link is invalid or expired" });
      return;
    }

    res.json({ message: "Email confirmed", status: result.status });
  } catch {
    res.status(500).json({ error: "Failed to confirm lead" });
  }
});

router.post("/unsubscribe", rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateTokenInput(req.body?.token);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const result = await unsubscribeLead(validated.value.token);
    if (result.status === "invalid") {
      res.status(400).json({ error: "Unsubscribe link is invalid" });
      return;
    }

    res.json({ message: "You have been unsubscribed", status: result.status });
  } catch {
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
});

export default router;
