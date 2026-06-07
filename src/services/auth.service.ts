import { apiClient } from "./api";
import Cookies from "universal-cookie";
import {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  ApiResponse,
} from "@/interfaces";

const cookies = new Cookies(null, { path: "/" });

class AuthService {
  async login(
    credentials: LoginRequest,
  ): Promise<ApiResponse<LoginResponse & { user: User }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<LoginResponse & { user: User }>,
        LoginRequest
      >("/auth/login", credentials);

      if (response.success && response.data) {
        if (typeof window !== "undefined") {
          const cookieOptions = {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
          };

          cookies.set("accessToken", response.data.accessToken, cookieOptions);
          cookies.set("user", response.data.user, cookieOptions);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(
    data: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await apiClient.post<
        ApiResponse<RegisterResponse>,
        RegisterRequest
      >("/auth/register", data);

      return response;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    if (typeof window !== "undefined") {
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("user", { path: "/" });
    }
  }

  getStoredUser(): User | null {
    const user = cookies.get("user");
    const token = this.getAccessToken();

    if (user && token) {
      return user as User;
    }

    if (typeof window !== "undefined" && (!user || !token)) {
      this.logout();
    }

    return null;
  }

  getAccessToken(): string | null {
    return cookies.get("accessToken") || null;
  }
}

export const authService = new AuthService();
