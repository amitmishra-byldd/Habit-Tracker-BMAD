import jwt from "jsonwebtoken";
import { environment } from "../config/environment.js";
/**
 * Generate a JWT token
 * @param userId - User ID
 * @param email - User email
 * @returns JWT token string
 */
export function generateToken(userId, email) {
    const payload = {
        userId,
        email,
    };
    const options = {
        expiresIn: environment.jwtExpiration,
        algorithm: "HS256",
    };
    return jwt.sign(payload, environment.jwtSecret, options);
}
/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, environment.jwtSecret);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token or null if not found
 */
export function extractTokenFromHeader(authHeader) {
    if (!authHeader)
        return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
        return null;
    return parts[1];
}
//# sourceMappingURL=jwtToken.js.map