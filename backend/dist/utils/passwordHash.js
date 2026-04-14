import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;
/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        throw new Error(`Failed to hash password: ${error}`);
    }
}
/**
 * Compare plain text password with hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePasswords(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (error) {
        throw new Error(`Failed to compare passwords: ${error}`);
    }
}
//# sourceMappingURL=passwordHash.js.map