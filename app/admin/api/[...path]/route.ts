import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import { connectToDatabase } from "@/lib/server/db";
import BlogArticle from "@/models/BlogArticle";
import Entitlement from "@/models/Entitlement";
import Lead from "@/models/Lead";
import LeadMagnet from "@/models/LeadMagnet";
import Order from "@/models/Order";
import Product from "@/models/Product";
import {
  createBlogArticle,
  deleteBlogArticle,
  getAdminBlogArticleById,
  listAdminBlogArticles,
  setBlogArticlePublished,
  updateBlogArticle,
} from "@/server/services/blogService";
import {
  createLeadMagnet,
  deleteLeadMagnet,
  getAdminLeadMagnetById,
  listAdminLeadMagnets,
  setLeadMagnetPublished,
  updateLeadMagnet,
} from "@/server/services/leadMagnetService";
import { listLeads } from "@/server/services/leadService";
import {
  createProduct,
  deleteProduct,
  getAdminProductById,
  listAdminProducts,
  setProductFeatured,
  setProductPublished,
  updateProduct,
} from "@/server/services/productService";
import { validateBlogInput } from "@/server/validators/blogValidator";
import { validateLeadMagnetInput } from "@/server/validators/leadMagnetValidator";
import { validateProductInput } from "@/server/validators/productValidator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    path: string[];
  };
};

function requireSession() {
  const session = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(session);
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function noContent() {
  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function withAdmin(handler: () => Promise<Response>) {
  if (!requireSession()) {
    return json({ error: "Unauthorized" }, 401);
  }

  await connectToDatabase();
  return handler();
}

function pathKey(context: RouteContext) {
  return context.params.path.join("/");
}

async function getAdminStats() {
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

  return {
    totalBlogArticles,
    publishedArticles,
    draftArticles,
    totalProducts,
    publishedProducts,
    totalLeads,
    confirmedLeads,
    leadMagnets,
  };
}

async function handleGet(request: NextRequest, context: RouteContext) {
  const path = pathKey(context);
  const segments = context.params.path;

  if (path === "admin/stats") return json(await getAdminStats());
  if (path === "blog/admin/all") return json(await listAdminBlogArticles());
  if (segments[0] === "blog" && segments[1] === "admin" && segments[2]) {
    const article = await getAdminBlogArticleById(segments[2]);
    return article ? json(article) : json({ error: "Article not found" }, 404);
  }

  if (path === "products/admin/all") return json(await listAdminProducts());
  if (segments[0] === "products" && segments[1] === "admin" && segments[2]) {
    const product = await getAdminProductById(segments[2]);
    return product ? json(product) : json({ error: "Product not found" }, 404);
  }

  if (path === "lead-magnets/admin/all") return json(await listAdminLeadMagnets());
  if (segments[0] === "lead-magnets" && segments[1] === "admin" && segments[2]) {
    const leadMagnet = await getAdminLeadMagnetById(segments[2]);
    return leadMagnet ? json(leadMagnet) : json({ error: "Lead magnet not found" }, 404);
  }

  if (path === "leads") return json(await listLeads());

  if (path === "orders") {
    const status = request.nextUrl.searchParams.get("status");
    const filter = status && status !== "all" ? { status } : {};
    return json(await Order.find(filter).sort({ createdAt: -1 }).limit(200));
  }
  if (segments[0] === "orders" && segments[1]) {
    const order = await Order.findById(segments[1]);
    return order ? json(order) : json({ error: "Order not found" }, 404);
  }

  if (path === "entitlements") {
    const filter: Record<string, unknown> = {};
    const status = request.nextUrl.searchParams.get("status");
    const productId = request.nextUrl.searchParams.get("productId");
    const customerEmail = request.nextUrl.searchParams.get("customerEmail");
    if (status && status !== "all") filter.status = status;
    if (productId) filter.productId = productId;
    if (customerEmail) filter.customerEmail = customerEmail.toLowerCase().trim();

    const entitlements = await Entitlement.find(filter)
      .populate("productId", "title slug")
      .sort({ createdAt: -1 })
      .limit(200);
    return json(entitlements);
  }

  return json({ error: "Admin API route is not implemented in Next.js" }, 404);
}

async function handlePost(request: NextRequest, context: RouteContext) {
  const path = pathKey(context);
  const body = await readJson(request);

  if (path === "blog") {
    const validated = validateBlogInput(body);
    if (!validated.ok) return json({ errors: validated.errors }, 400);
    return json(await createBlogArticle(validated.value), 201);
  }

  if (path === "products") {
    const validated = validateProductInput(body);
    if (!validated.ok) return json({ errors: validated.errors }, 400);
    return json(await createProduct(validated.value), 201);
  }

  if (path === "lead-magnets") {
    const validated = validateLeadMagnetInput(body);
    if (!validated.ok) return json({ errors: validated.errors }, 400);
    return json(await createLeadMagnet(validated.value), 201);
  }

  return json({ error: "Admin API route is not implemented in Next.js" }, 404);
}

async function handlePut(request: NextRequest, context: RouteContext) {
  const segments = context.params.path;
  const body = await readJson(request);

  if (segments[0] === "blog" && segments[1]) {
    const validated = validateBlogInput(body, true);
    if (!validated.ok) return json({ errors: validated.errors }, 400);
    const article = await updateBlogArticle(segments[1], validated.value);
    return article ? json(article) : json({ error: "Article not found" }, 404);
  }

  if (segments[0] === "products" && segments[1]) {
    const validated = validateProductInput(body, true);
    if (!validated.ok) return json({ errors: validated.errors }, 400);
    const product = await updateProduct(segments[1], validated.value);
    return product ? json(product) : json({ error: "Product not found" }, 404);
  }

  if (segments[0] === "lead-magnets" && segments[1]) {
    const validated = validateLeadMagnetInput(body, true);
    if (!validated.ok) return json({ errors: validated.errors }, 400);
    const leadMagnet = await updateLeadMagnet(segments[1], validated.value);
    return leadMagnet ? json(leadMagnet) : json({ error: "Lead magnet not found" }, 404);
  }

  return json({ error: "Admin API route is not implemented in Next.js" }, 404);
}

async function handlePatch(request: NextRequest, context: RouteContext) {
  const segments = context.params.path;
  const body = await readJson(request);

  if (segments[0] === "blog" && segments[1] && segments[2] === "publish") {
    const article = await setBlogArticlePublished(segments[1], body?.isPublished === true);
    return article ? json(article) : json({ error: "Article not found" }, 404);
  }

  if (segments[0] === "products" && segments[1] && segments[2] === "publish") {
    const product = await setProductPublished(segments[1], body?.isPublished === true);
    return product ? json(product) : json({ error: "Product not found" }, 404);
  }

  if (segments[0] === "products" && segments[1] && segments[2] === "feature") {
    const product = await setProductFeatured(segments[1], body?.isFeatured === true);
    return product ? json(product) : json({ error: "Product not found" }, 404);
  }

  if (segments[0] === "lead-magnets" && segments[1] && segments[2] === "publish") {
    const leadMagnet = await setLeadMagnetPublished(segments[1], body?.isPublished === true);
    return leadMagnet ? json(leadMagnet) : json({ error: "Lead magnet not found" }, 404);
  }

  if (segments[0] === "entitlements" && segments[1] && segments[2] === "revoke") {
    const entitlement = await Entitlement.findByIdAndUpdate(segments[1], { status: "revoked" }, { new: true });
    return entitlement ? json(entitlement) : json({ error: "Entitlement not found" }, 404);
  }

  return json({ error: "Admin API route is not implemented in Next.js" }, 404);
}

async function handleDelete(_request: NextRequest, context: RouteContext) {
  const segments = context.params.path;

  if (segments[0] === "blog" && segments[1]) {
    const article = await deleteBlogArticle(segments[1]);
    return article ? noContent() : json({ error: "Article not found" }, 404);
  }

  if (segments[0] === "products" && segments[1]) {
    const product = await deleteProduct(segments[1]);
    return product ? noContent() : json({ error: "Product not found" }, 404);
  }

  if (segments[0] === "lead-magnets" && segments[1]) {
    const leadMagnet = await deleteLeadMagnet(segments[1]);
    return leadMagnet ? noContent() : json({ error: "Lead magnet not found" }, 404);
  }

  return json({ error: "Admin API route is not implemented in Next.js" }, 404);
}

async function handleError(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[admin-api-next]", error);
  }
  return json({ error: "Admin API request failed" }, 500);
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    return await withAdmin(() => handleGet(request, context));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    return await withAdmin(() => handlePost(request, context));
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    return await withAdmin(() => handlePut(request, context));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    return await withAdmin(() => handlePatch(request, context));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    return await withAdmin(() => handleDelete(request, context));
  } catch (error) {
    return handleError(error);
  }
}
