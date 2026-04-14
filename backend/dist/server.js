import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { environment } from "./config/environment.js";
import authRouter from "./routes/auth.js";
export function createApp() {
    const app = express();
    // Security middleware
    app.use(helmet());
    // CORS configuration
    app.use(cors({
        origin: environment.frontendUrl,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    // Body parsing middleware
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    // Cookie parsing
    app.use(cookieParser());
    // Request logging middleware
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
    // Health check endpoint
    app.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });
    // API routes
    app.use("/api/auth", authRouter);
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.method} ${req.path} not found`,
        });
    });
    // Global error handler
    app.use((err, req, res, next) => {
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
//# sourceMappingURL=server.js.map