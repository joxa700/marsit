import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login qilmagan foydalanuvchini /login ga qaytaradi.
 * Admin student sahifalariga o'tmoqchi bo'lsa /admin ga yuboriladi.
 */
export function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

/**
 * Faqat admin uchun. Student /admin ga kirsa asosiy sahifaga qaytariladi.
 */
export function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
