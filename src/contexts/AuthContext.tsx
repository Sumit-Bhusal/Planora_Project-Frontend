import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'user' | 'organizer') => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'user' | 'organizer', interests?: string[]) => Promise<void>;
  loginWithGoogle: (role?: 'user' | 'organizer') => Promise<void>;
  logout: () => void;
  switchRole: (role: 'user' | 'organizer') => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore auto-login functionality
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'organizer' = 'user') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
      interests: role === 'user' ? ['Technology', 'Business', 'Arts'] : [],
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signup = async (email: string, password: string, name: string, role: 'user' | 'organizer', interests: string[] = []) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      interests: role === 'user' ? interests : [],
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const loginWithGoogle = async (role: 'user' | 'organizer' = 'user') => {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Google user data
    const googleUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      name: 'Google User',
      role,
      interests: role === 'user' ? ['Technology', 'Business', 'Arts'] : [],
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      createdAt: new Date(),
    };
    
    setUser(googleUser);
    localStorage.setItem('user', JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const switchRole = (role: 'user' | 'organizer') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      loginWithGoogle,
      logout,
      switchRole,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};