import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import caseRoutes from "./routes/cases.js";

export const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "intelscope-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server" });
});
