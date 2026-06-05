import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (record.count >= MAX_REQUESTS) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  record.count += 1;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    res.status(403).json({ error: "Content writes are disabled" });
    return;
  }

  const adminTokenBuffer = Buffer.from(adminToken);
  const headerTokenBuffer = Buffer.from(req.get("x-admin-token") || "");
  const bearerBuffer = Buffer.from(req.get("authorization") || "");
  const expectedBearerBuffer = Buffer.from(`Bearer ${adminToken}`);
  const validHeaderToken =
    headerTokenBuffer.length === adminTokenBuffer.length &&
    crypto.timingSafeEqual(headerTokenBuffer, adminTokenBuffer);
  const validBearerToken =
    bearerBuffer.length === expectedBearerBuffer.length &&
    crypto.timingSafeEqual(bearerBuffer, expectedBearerBuffer);
  const valid = validHeaderToken || validBearerToken;

  if (!valid) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
