/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Compare plain text password with hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns Promise<boolean> - True if passwords match
 */
export declare function comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
//# sourceMappingURL=passwordHash.d.ts.map