// AuthContext — login/logout and persisted user session state
import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, sanitizeAccount } from '../api/auth';
import { isAdminAccount } from '../config/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read persisted user from localStorage on initialization
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('marsit_user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed ? sanitizeAccount(parsed) : null;
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
   * Login with email and password via mockapi.io.
   * Returns safe user data on success, null on failure.
   */
  async function login(email, password) {
    setLoading(true);
    setError('');
    try {
      const safeUser = await loginUser({ email, password });
      setUser(safeUser);
      return safeUser;
    } catch (err) {
      setError(err.message || 'Kirishda xatolik yuz berdi');
      return null;
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

  const isAdmin = isAdminAccount(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
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
