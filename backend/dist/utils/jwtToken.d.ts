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
export declare function generateToken(userId: string, email: string): string;
/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export declare function verifyToken(token: string): JWTPayload | null;
/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token or null if not found
 */
export declare function extractTokenFromHeader(authHeader?: string): string | null;
//# sourceMappingURL=jwtToken.d.ts.map