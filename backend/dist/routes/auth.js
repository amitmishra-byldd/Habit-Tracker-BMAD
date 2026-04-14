import { Router } from "express";
import { handleRegister, handleLogin, handleLogout, handleGetMe, } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/rateLimit.js";
const authRouter = Router();
/**
 * POST /api/auth/register
 * Register a new user
 * Rate limited to 5 attempts per minute
 */
authRouter.post("/register", authRateLimiter, handleRegister);
/**
 * POST /api/auth/login
 * Login user
 * Rate limited to 5 attempts per minute
 */
authRouter.post("/login", authRateLimiter, handleLogin);
/**
 * POST /api/auth/logout
 * Logout user
 */
authRouter.post("/logout", handleLogout);
/**
 * GET /api/auth/me
 * Get current authenticated user
 */
authRouter.get("/me", handleGetMe);
export default authRouter;
//# sourceMappingURL=auth.js.map