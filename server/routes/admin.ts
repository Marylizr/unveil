import { Router, Request, Response } from "express";
import BlogArticle from "../../models/BlogArticle";
import Lead from "../../models/Lead";
import LeadMagnet from "../../models/LeadMagnet";
import Product from "../../models/Product";
import { requireAdmin } from "../security";

const router = Router();

router.get("/stats", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [
      totalBlogArticles,
      publishedArticles,
      draftArticles,
      totalProducts,
      publishedProducts,
      totalLeads,
      confirmedLeads,
      leadMagnets,
    ] = await Promise.all([
      BlogArticle.countDocuments(),
      BlogArticle.countDocuments({ isPublished: true }),
      BlogArticle.countDocuments({ isPublished: false }),
      Product.countDocuments(),
      Product.countDocuments({ isPublished: true }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: "confirmed" }),
      LeadMagnet.countDocuments(),
    ]);

    res.json({
      totalBlogArticles,
      publishedArticles,
      draftArticles,
      totalProducts,
      publishedProducts,
      totalLeads,
      confirmedLeads,
      leadMagnets,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
