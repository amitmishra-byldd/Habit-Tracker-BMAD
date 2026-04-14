import dotenv from "dotenv";

dotenv.config();

export const environment = {
  port: parseInt(process.env.PORT || "5000"),
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Database
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/habit-tracker",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "24h",

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5"),

  // CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}
