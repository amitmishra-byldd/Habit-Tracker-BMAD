import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../middleware/validation.js";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/authService.js";
import { environment } from "../config/environment.js";
import { extractTokenFromHeader, verifyToken } from "../utils/jwtToken.js";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function handleRegister(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
        message: "Validation failed",
      });
    }

    // Register user
    const result = await registerUser(validation.data);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Set JWT in httpOnly cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: environment.isProduction, // HTTPS only in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return success response
    return res.status(201).json({
      success: true,
      user: result.user,
      message: result.message,
    });
  } catch (error) {
    console.error("Register controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
}

/**
 * POST /api/auth/login
 * Login user
 */
export async function handleLogin(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
        message: "Validation failed",
      });
    }

    // Login user
    const result = await loginUser(validation.data);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set JWT in httpOnly cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: environment.isProduction,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      user: result.user,
      message: result.message,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
}

/**
 * POST /api/auth/logout
 * Logout user
 */
export async function handleLogout(req: Request, res: Response) {
  try {
    // Clear JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: environment.isProduction,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function handleGetMe(req: Request, res: Response) {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token || extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // Get user from database
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Get me controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
}
