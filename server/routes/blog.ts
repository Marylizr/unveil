import { Router, Request, Response } from "express";
import { requireAdmin, rateLimit } from "../security";
import {
  createBlogArticle,
  deleteBlogArticle,
  getBlogArticleBySlug,
  getAdminBlogArticleById,
  listAdminBlogArticles,
  listBlogArticles,
  listBlogArticlesByCategory,
  setBlogArticlePublished,
  updateBlogArticle,
} from "../services/blogService";
import { validateBlogInput } from "../validators/blogValidator";

const router = Router();

router.get("/admin/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json(await listAdminBlogArticles());
  } catch {
    res.status(500).json({ error: "Failed to fetch admin articles" });
  }
});

router.get("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const article = await getAdminBlogArticleById(req.params.id);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(article);
  } catch {
    res.status(500).json({ error: "Failed to fetch admin article" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json(await listBlogArticles());
  } catch {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    res.json(await listBlogArticlesByCategory(req.params.category));
  } catch {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const article = await getBlogArticleBySlug(req.params.slug);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(article);
  } catch {
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

router.post("/", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateBlogInput(req.body);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }
    res.status(201).json(await createBlogArticle(validated.value));
  } catch {
    res.status(400).json({ error: "Failed to create article" });
  }
});

router.put("/:id", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateBlogInput(req.body, true);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const article = await updateBlogArticle(req.params.id, validated.value);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(article);
  } catch {
    res.status(400).json({ error: "Failed to update article" });
  }
});

router.delete("/:id", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const article = await deleteBlogArticle(req.params.id);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Failed to delete article" });
  }
});

router.patch("/:id/publish", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const article = await setBlogArticlePublished(req.params.id, req.body.isPublished === true);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(article);
  } catch {
    res.status(400).json({ error: "Failed to publish article" });
  }
});

export default router;
