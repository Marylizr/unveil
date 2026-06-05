import { Router, Request, Response } from "express";
import { requireAdmin, rateLimit } from "../security";
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getAdminProductById,
  listAdminProducts,
  listProducts,
  listProductsByCategory,
  setProductFeatured,
  setProductPublished,
  updateProduct,
} from "../services/productService";
import { validateProductInput } from "../validators/productValidator";

const router = Router();

router.get("/admin/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    res.json(await listAdminProducts());
  } catch {
    res.status(500).json({ error: "Failed to fetch admin products" });
  }
});

router.get("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await getAdminProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch admin product" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json(await listProducts());
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    res.json(await listProductsByCategory(req.params.category));
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const product = await getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateProductInput(req.body);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    res.status(201).json(await createProduct(validated.value));
  } catch {
    res.status(400).json({ error: "Failed to create product" });
  }
});

router.put("/:id", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const validated = validateProductInput(req.body, true);
    if (!validated.ok) {
      res.status(400).json({ errors: validated.errors });
      return;
    }

    const product = await updateProduct(req.params.id, validated.value);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(400).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const product = await deleteProduct(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Failed to delete product" });
  }
});

router.patch("/:id/publish", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const product = await setProductPublished(req.params.id, req.body.isPublished === true);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(400).json({ error: "Failed to publish product" });
  }
});

router.patch("/:id/feature", requireAdmin, rateLimit, async (req: Request, res: Response) => {
  try {
    const product = await setProductFeatured(req.params.id, req.body.isFeatured === true);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(400).json({ error: "Failed to feature product" });
  }
});

export default router;
