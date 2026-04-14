import jwt, { SignOptions } from "jsonwebtoken";
import { environment } from "../config/environment.js";

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Generate a JWT token
 * @param userId - User ID
 * @param email - User email
 * @returns JWT token string
 */
export function generateToken(userId: string, email: string): string {
  const payload = {
    userId,
    email,
  };

  const options: SignOptions = {
    expiresIn: environment.jwtExpiration as any,
    algorithm: "HS256",
  };

  return jwt.sign(payload, environment.jwtSecret, options);
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, environment.jwtSecret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token or null if not found
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}
