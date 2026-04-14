import { User, IUser } from "../models/User.js";
import { hashPassword, comparePasswords } from "../utils/passwordHash.js";
import { generateToken } from "../utils/jwtToken.js";
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
export async function registerUser(
  registerData: RegisterRequest,
): Promise<RegisterResponse> {
  try {
    const { email, username, password } = registerData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          message: "Email already registered",
        };
      }
      if (existingUser.username === username) {
        return {
          success: false,
          message: "Username already taken",
        };
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = new User({
      email,
      username,
      passwordHash,
      isActive: true,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.email);

    return {
      success: true,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
      },
      token,
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    };
  }
}

/**
 * Login user
 */
export async function loginUser(
  loginData: LoginRequest,
): Promise<LoginResponse> {
  try {
    const { email, password } = loginData;

    // Find user by email
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      token,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
