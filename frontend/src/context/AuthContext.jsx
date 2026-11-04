import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('library_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('library_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token and user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('library_token');
      if (savedToken) {
        try {
          const res = await authService.me();
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem('library_user', JSON.stringify(res.data.data.user));
          }
        } catch {
          // Token is invalid/expired
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to unauthorized event from axios
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.success && res.data?.data) {
      const { user: userData, token: userToken } = res.data.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('library_token', userToken);
      localStorage.setItem('library_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: res.data?.message || 'Login gagal.' };
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await authService.register({
      name,
      email,
      password,
      password_confirmation,
    });
    if (res.data?.success && res.data?.data) {
      const { user: userData, token: userToken } = res.data.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('library_token', userToken);
      localStorage.setItem('library_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: res.data?.message || 'Registrasi gagal.' };
  };

  const logout = async () => {
    // Clear the local session immediately so the UI switches without a page refresh.
    const logoutRequest = token
      ? authService.logout().catch(() => null)
      : Promise.resolve(null);

    setUser(null);
    setToken(null);
    localStorage.removeItem('library_token');
    localStorage.removeItem('library_user');

    await logoutRequest;
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.data?.success && res.data?.data?.user) {
      setUser(res.data.data.user);
      localStorage.setItem('library_user', JSON.stringify(res.data.data.user));
      return { success: true, user: res.data.data.user };
    }
    return { success: false, message: res.data?.message };
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

