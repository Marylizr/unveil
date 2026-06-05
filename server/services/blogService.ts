import BlogArticle, { BLOG_CATEGORY_VALUES } from "../../models/BlogArticle";
import { serializeBlogArticle } from "../serializers/blogSerializer";
import { categoryFromSlug } from "./categoryService";
import { normalizePublishingFields, publicPublishedQuery } from "./publishingWorkflow";

export async function listBlogArticles() {
  const articles = await BlogArticle.find(publicPublishedQuery()).sort({ publishedAt: -1, createdAt: -1 });
  return articles.map(serializeBlogArticle);
}

export async function listAdminBlogArticles() {
  const articles = await BlogArticle.find().sort({ publishedAt: -1, createdAt: -1 });
  return articles.map(serializeBlogArticle);
}

export async function getAdminBlogArticleById(id: string) {
  const article = await BlogArticle.findById(id);
  return article ? serializeBlogArticle(article) : null;
}

export async function getBlogArticleBySlug(slug: string) {
  const article = await BlogArticle.findOne({ slug, ...publicPublishedQuery() })
    .populate("relatedArticles")
    .populate("relatedProducts");
  return article ? serializeBlogArticle(article) : null;
}

export async function listBlogArticlesByCategory(categorySlug: string) {
  const category = categoryFromSlug(categorySlug, BLOG_CATEGORY_VALUES);
  if (!category) return [];

  const articles = await BlogArticle.find({ category, ...publicPublishedQuery() }).sort({ publishedAt: -1, createdAt: -1 });
  return articles.map(serializeBlogArticle);
}

export async function createBlogArticle(input: Record<string, unknown>) {
  const article = await BlogArticle.create(normalizePublishingFields(input));
  return serializeBlogArticle(article);
}

export async function updateBlogArticle(id: string, input: Record<string, unknown>) {
  const article = await BlogArticle.findByIdAndUpdate(id, normalizePublishingFields(input), { new: true, runValidators: true });
  return article ? serializeBlogArticle(article) : null;
}

export async function deleteBlogArticle(id: string) {
  return BlogArticle.findByIdAndDelete(id);
}

export async function setBlogArticlePublished(id: string, isPublished: boolean) {
  return updateBlogArticle(id, {
    publicationStatus: isPublished ? "published" : "draft",
  });
}
