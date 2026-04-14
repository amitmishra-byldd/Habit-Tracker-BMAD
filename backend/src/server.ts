import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { environment } from "./config/environment.js";
import authRouter from "./routes/auth.js";
import habitRouter from "./routes/habit";

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: environment.frontendUrl,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Cookie parsing
  app.use(cookieParser());

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // API routes
  app.use("/api/auth", authRouter);
  app.use("/api/habits", habitRouter);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: environment.isProduction
        ? "An unexpected error occurred"
        : err.message,
    });
  });

  return app;
}
