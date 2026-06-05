export function categoryToSlug(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function categoryFromSlug(slug: string, categories: readonly string[]) {
  const normalized = categoryToSlug(slug);
  return categories.find((category) => categoryToSlug(category) === normalized || category === slug);
}

