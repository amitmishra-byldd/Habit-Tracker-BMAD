import { Request, Response } from "express";
/**
 * POST /api/auth/register
 * Register a new user
 */
export declare function handleRegister(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * POST /api/auth/login
 * Login user
 */
export declare function handleLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * POST /api/auth/logout
 * Logout user
 */
export declare function handleLogout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export declare function handleGetMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map