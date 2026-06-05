import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/products";
import blogRouter from "./routes/blog";
import postsRouter from "./routes/posts";
import leadsRouter from "./routes/leads";
import subscribersRouter from "./routes/subscribers";
import leadMagnetsRouter from "./routes/leadMagnets";
import adminRouter from "./routes/admin";
import ordersRouter from "./routes/orders";
import entitlementsRouter from "./routes/entitlements";
import { captureServerException, setupSentryErrorHandler } from "./sentry";
import { startEmailSequenceWorker } from "./services/emailSequenceService";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = Number(process.env.API_PORT || process.env.PORT || 3002);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/unveil";
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const apiRouteMounts = [
  "/api/products",
  "/api/blog",
  "/api/posts",
  "/api/leads",
  "/api/subscribe",
  "/api/lead-magnets",
  "/api/admin",
  "/api/orders",
  "/api/entitlements",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "5mb" }));

app.use("/api/products", productsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/posts", postsRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/subscribe", subscribersRouter);
app.use("/api/lead-magnets", leadMagnetsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/entitlements", entitlementsRouter);

app.get("/", (_req, res) => {
  res.json({
    name: "UNVEIL API",
    status: "ok",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

setupSentryErrorHandler(app);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    if (process.env.NODE_ENV !== "production") {
      console.info("Registered API route mounts:", apiRouteMounts.join(", "));
    }
    startEmailSequenceWorker();
    app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
  })
  .catch(async (err) => {
    console.error("MongoDB connection error:", err);
    await captureServerException(err);
    process.exit(1);
  });
