import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { registerUserandOrganizer, UserLogin } from "../actions/login/login";
import { LoginData, RegisterData } from "../types/auth";
import { decodeToken } from "../helper/decodeToken";
import { removeCookie, setCookie } from "../lib/cookies";
import { PaymentDataForPayment } from "../types/payment";

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (role?: "user" | "organizer") => Promise<void>;
  logout: () => void;
  switchRole: (role: "user" | "organizer") => void;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<void>;
  Login: (data: LoginData) => Promise<void>;
  paymentData: PaymentDataForPayment;
  setPaymentData: React.Dispatch<React.SetStateAction<PaymentDataForPayment>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentDataForPayment>({
    amount: 0,
    currency: "npr",
    paymentMethod: "esewa",
    participationId: "",
    signature: "",
    signedFields: "",
    transactionUUID: "",
  });

  useEffect(() => {
    // Restore auto-login functionality
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        // parsedUser.createdAt = new Date(parsedUser.createdAt);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (data: RegisterData) => {
    const response = await registerUserandOrganizer(data);
    if (response && response.status === "success") {
      const userData = await decodeToken(response.data.accessToken);
      const newUser: User = {
        id: userData.sub,
        name: userData.name,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
        role: (userData as any).role || "user", // Default to 'user' if not present
        email: (userData as any).email || undefined,
      };
      setCookie({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      throw new Error(response?.message || "Registration failed");
    }
  };

  const Login = async (data: LoginData) => {
    const response = await UserLogin(data);
    if (response && response.status === "success") {
      const userData = await decodeToken(response.data.accessToken);
      const newUser: User = {
        id: userData.sub,
        name: userData.name,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
        role: (userData as any).role || "user", // Default to 'user' if not present
        email: (userData as any).email || undefined,
      };
      setCookie({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      throw new Error(response?.message || "Login failed");
    }
  };

  const loginWithGoogle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock Google user data
    const googleUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Google User",
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      role: "user", // Default role for mock Google user
      email: "googleuser@example.com",
    };

    setUser(googleUser);
    localStorage.setItem("user", JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    removeCookie();
    localStorage.removeItem("user");
  };

  const switchRole = (role: "user" | "organizer") => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
        switchRole,
        isLoading,
        register,
        Login,
        paymentData,
        setPaymentData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
