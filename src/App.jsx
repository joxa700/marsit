// App entry & routing
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout, { ADMIN_NAV_ITEMS } from './components/layout/AppLayout';
import AIAssistant from './components/AIAssistant/AIAssistant';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import MyCoursesPage from './pages/MyCourses/MyCoursesPage';
import MyWorksPage from './pages/MyWorks/MyWorksPage';
import BattlePage from './pages/Battle/BattlePage';
import HackathonPage from './pages/Hackathon/HackathonPage';
import EduversPage from './pages/Eduvers/EduversPage';
import BlogPage from './pages/Blog/BlogPage';
import ProfilePage from './pages/Profile/ProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStudentDetail from './pages/admin/AdminStudentDetail';
import AdminGroups from './pages/admin/AdminGroups';
import AdminGroupDetail from './pages/admin/AdminGroupDetail';
import AdminWorks from './pages/admin/AdminWorks';
import AdminCourses from './pages/admin/AdminCourses';
import AdminBlog from './pages/admin/AdminBlog';
import './pages/admin/admin.css';

function StudentShell({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
      <AIAssistant />
    </ProtectedRoute>
  );
}

function AdminShell({ children }) {
  return (
    <AdminRoute>
      <AppLayout navItems={ADMIN_NAV_ITEMS} homePath="/admin" adminMode>
        {children}
      </AppLayout>
      <AIAssistant />
    </AdminRoute>
  );
}

export default function App() {
  const { user, isAdmin } = useAuth();
  const homeForUser = isAdmin ? '/admin' : '/';

  return (
    <>
      <Routes>
        {/* Public Login */}
        <Route
          path="/login"
          element={user ? <Navigate to={homeForUser} replace /> : <LoginPage />}
        />

        {/* Student pages inside common AppLayout */}
        <Route path="/" element={<StudentShell><HomePage /></StudentShell>} />
        <Route path="/courses" element={<StudentShell><MyCoursesPage /></StudentShell>} />
        <Route path="/works" element={<StudentShell><MyWorksPage /></StudentShell>} />
        <Route path="/battle" element={<StudentShell><BattlePage /></StudentShell>} />
        <Route path="/hackathon" element={<StudentShell><HackathonPage /></StudentShell>} />
        <Route path="/eduvers" element={<StudentShell><EduversPage /></StudentShell>} />
        <Route path="/blog" element={<StudentShell><BlogPage /></StudentShell>} />
        <Route path="/profile" element={<StudentShell><ProfilePage /></StudentShell>} />

        {/* Admin panel */}
        <Route path="/admin" element={<AdminShell><AdminDashboard /></AdminShell>} />
        <Route path="/admin/students" element={<AdminShell><AdminStudents /></AdminShell>} />
        <Route path="/admin/students/:studentId" element={<AdminShell><AdminStudentDetail /></AdminShell>} />
        <Route path="/admin/groups" element={<AdminShell><AdminGroups /></AdminShell>} />
        <Route path="/admin/groups/:groupId" element={<AdminShell><AdminGroupDetail /></AdminShell>} />
        <Route path="/admin/works" element={<AdminShell><AdminWorks /></AdminShell>} />
        <Route path="/admin/courses" element={<AdminShell><AdminCourses /></AdminShell>} />
        <Route path="/admin/blog" element={<AdminShell><AdminBlog /></AdminShell>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? homeForUser : '/login'} replace />} />
      </Routes>
    </>
  );
}
