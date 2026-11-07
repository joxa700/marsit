// App entry & routing
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import AIAssistant from './components/AIAssistant/AIAssistant';

// Pages
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import MyCoursesPage from './pages/MyCourses/MyCoursesPage';
import MyWorksPage from './pages/MyWorks/MyWorksPage';
import BattlePage from './pages/Battle/BattlePage';
import HackathonPage from './pages/Hackathon/HackathonPage';
import EduversPage from './pages/Eduvers/EduversPage';
import ProfilePage from './pages/Profile/ProfilePage';

/**
 * ProtectedRoute guard: redirects unauthenticated users to /login
 */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Standalone Eduvers Landing */}
        <Route
          path="/eduvers"
          element={
            <ProtectedRoute>
              <>
                <EduversPage />
                <AIAssistant />
              </>
            </ProtectedRoute>
          }
        />

        {/* Protected pages inside AppLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HomePage />
              </AppLayout>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyCoursesPage />
              </AppLayout>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/works"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyWorksPage />
              </AppLayout>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/battle"
          element={
            <ProtectedRoute>
              <AppLayout>
                <BattlePage />
              </AppLayout>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hackathon"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HackathonPage />
              </AppLayout>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
