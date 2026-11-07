// AuthContext — handles login/registration/logout and user session state
import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read persisted user from localStorage on initialization
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('marsit_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('marsit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('marsit_user');
    }
  }, [user]);

  /**
   * Login with email and password via mockapi.io
   */
  async function login(email, password) {
    setLoading(true);
    setError('');
    try {
      const safeUser = await loginUser({ email, password });
      setUser(safeUser);
      return true;
    } catch (err) {
      setError(err.message || 'Kirishda xatolik yuz berdi');
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Register new user via mockapi.io and automatically log in
   */
  async function register({ email, password, name }) {
    setLoading(true);
    setError('');
    try {
      const safeUser = await registerUser({ email, password, name });
      setUser(safeUser);
      return true;
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Logout user and clear localStorage session
   */
  function logout() {
    setUser(null);
    localStorage.removeItem('marsit_user');
  }

  /**
   * Update profile details
   */
  function updateUser(updates) {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
