import { IUser } from "../models/User.js";
import { RegisterRequest, LoginRequest } from "../middleware/validation.js";
export interface RegisterResponse {
    success: boolean;
    user?: {
        id: string;
        email: string;
        username: string;
    };
    token?: string;
    message: string;
}
export interface LoginResponse {
    success: boolean;
    user?: {
        id: string;
        email: string;
        username: string;
    };
    token?: string;
    message: string;
}
/**
 * Register a new user
 */
export declare function registerUser(registerData: RegisterRequest): Promise<RegisterResponse>;
/**
 * Login user
 */
export declare function loginUser(loginData: LoginRequest): Promise<LoginResponse>;
/**
 * Get user by ID
 */
export declare function getUserById(userId: string): Promise<IUser | null>;
//# sourceMappingURL=authService.d.ts.map