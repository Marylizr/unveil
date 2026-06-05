export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

export type LocalizedText = { en: string; pt: string; es: string };

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function sanitizeString(value: unknown) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map(sanitizeString).filter(Boolean);
}

export function optionalString(value: unknown) {
  const clean = sanitizeString(value);
  return clean || undefined;
}

export function localizedText(value: unknown, field: string, errors: string[]): LocalizedText {
  const source = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  const en = sanitizeString(source.en);
  const pt = sanitizeString(source.pt);
  const es = sanitizeString(source.es);

  if (!en) errors.push(`${field}.en is required`);
  return { en, pt, es };
}

export function numberValue(value: unknown, field: string, errors: string[], required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) errors.push(`${field} is required`);
    return undefined;
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    errors.push(`${field} must be a non-negative number`);
    return undefined;
  }
  return number;
}

export function booleanValue(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  return fallback;
}

export function enumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  field: string,
  errors: string[],
  fallback?: T[number]
) {
  const clean = sanitizeString(value);
  if (!clean && fallback) return fallback;
  if (allowed.includes(clean)) return clean as T[number];
  errors.push(`${field} must be one of: ${allowed.join(", ")}`);
  return fallback || allowed[0];
}

