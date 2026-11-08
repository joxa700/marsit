// AppLayout — Mars IT TopBar (Header) + Sidebar + Main content layout
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Briefcase,
  Swords,
  Rocket,
  Globe,
  Wallet,
  Flame,
  Coins,
  Zap,
  Crown,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Layers,
  ClipboardList,
} from 'lucide-react';
import './layout.css';
import { Avatar } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useUserStats } from '../../context/UserStatsContext';
import { initialNotifications } from '../../data/notifications';

// Sidebar menu items: Uzbek labels, same routes, gray outlined icons
export const STUDENT_NAV_ITEMS = [
  { path: '/',          label: 'Asosiy',          shortLabel: 'Asosiy',    icon: Home },
  { path: '/courses',   label: 'Kurslarim',       shortLabel: 'Kurslarim', icon: BookOpen },
  { path: '/works',     label: 'Mening ishlarim', shortLabel: 'Ishlarim',  icon: Briefcase },
  { path: '/battle',    label: 'Battle',          shortLabel: 'Battle',    icon: Swords },
  { path: '/hackathon', label: 'Xakaton',         shortLabel: 'Xakaton',   icon: Rocket },
  { path: '/eduvers',   label: 'Eduverse',        shortLabel: 'Eduverse',  icon: Globe },
];

export const ADMIN_NAV_ITEMS = [
  { path: '/admin',          label: 'Dashboard',  shortLabel: 'Asosiy',    icon: LayoutDashboard, end: true },
  { path: '/admin/students', label: "O'quvchilar", shortLabel: "O'quvchi", icon: Users },
  { path: '/admin/groups',   label: 'Guruhlar',   shortLabel: 'Guruhlar',  icon: Layers },
  { path: '/admin/works',    label: 'Ishlar',     shortLabel: 'Ishlar',    icon: ClipboardList },
  { path: '/admin/courses',  label: 'Kurslar',    shortLabel: 'Kurslar',   icon: BookOpen },
];

export default function AppLayout({
  children,
  navItems = STUDENT_NAV_ITEMS,
  homePath = '/',
  adminMode = false,
}) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme, cycleTheme, currentTheme } = useTheme();
  const { stats, animating } = useUserStats();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      {/* Sidebar overlay for mobile slide-in drawer */}
      <div
        className={['sidebar-overlay', sidebarOpen ? 'show' : ''].join(' ')}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ===== TOPBAR (HEADER) ===== */}
      {/* Full width, white background, thin bottom border, height ~72px */}
      <header className="topbar" role="banner">
        {/* Left side: Hamburger (mobile) + Mars Logo */}
        <div className="topbar-left">
          <button
            type="button"
            className="hamburger"
            aria-label="Menyuni ochish"
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? <X size={22} color="#1f2937" /> : <Menu size={22} color="#1f2937" />}
          </button>

          {/* Logo wrapped in Link to home page */}
          <Link to={homePath} className="topbar-logo-link" title="Mars IT">
            <img src="/mars-logo.png" alt="Mars" className="topbar-logo-img" />
          </Link>
        </div>

        {/* Right side: Stats, Premium, Theme Switcher, Notifications, Avatar */}
        <div className="topbar-right">
          {/* Stats inside ONE rounded white container with thin dividers */}
          <div className="topbar-stats-group" title="Foydalanuvchi ko'rsatkichlari">
            {/* Balance: Green wallet icon */}
            <div className={['stat-item', animating.balance ? 'animating' : ''].join(' ')} title="Balans">
              <Wallet size={18} className="stat-icon-wallet" />
              <span className="stat-value">{stats.balance.toLocaleString('ru')}</span>
            </div>

            <div className="stat-v-divider" />

            {/* Streak: Orange fire */}
            <div className={['stat-item', animating.streak ? 'animating' : ''].join(' ')} title="Kunlik seriya">
              <Flame size={18} className="stat-icon-flame" />
              <span className="stat-value">{stats.streak}</span>
            </div>

            <div className="stat-v-divider" />

            {/* Coins: Gold coin */}
            <div className={['stat-item', animating.coins ? 'animating' : ''].join(' ')} title="Tangalar">
              <Coins size={18} className="stat-icon-coins" />
              <span className="stat-value">{stats.coins}</span>
            </div>

            <div className="stat-v-divider" />

            {/* Energy: Yellow lightning */}
            <div className={['stat-item', animating.lightning ? 'animating' : ''].join(' ')} title="Energiya">
              <Zap size={18} className="stat-icon-energy" />
              <span className="stat-value">{stats.lightning}</span>
            </div>
          </div>

          {/* Premium as plain text with a gold crown icon */}
          <button
            type="button"
            className="topbar-premium-link"
            onClick={() => alert("Mars Premium — barcha materiallar va kurslarga cheksiz kirish!")}
          >
            <Crown size={18} className="premium-crown-icon" />
            <span>Premium</span>
          </button>

          {/* Theme switcher: rounded container with thin border, active is black pill with white text, others plain gray without emoji */}
          <div className="theme-switcher" role="group" aria-label="Mavzuni tanlash">
            {THEMES.map(t => (
              <button
                key={t.id}
                type="button"
                className={['theme-btn', theme === t.id ? 'active' : ''].join(' ')}
                onClick={() => setTheme(t.id)}
                title={t.label}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Mobile cycle theme button */}
          <button
            type="button"
            className="theme-cycle-btn-mobile"
            onClick={cycleTheme}
            title={`Mavzu: ${currentTheme.label}`}
            aria-label="Mavzuni almashtirish"
          >
            🎨
          </button>

          {/* Gray outline notification bell with small red badge */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="topbar-icon-btn"
              aria-label={`Bildirishnomalar (${unreadCount} ta o'qilmagan)`}
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            >
              <Bell size={20} className="bell-outline-icon" />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <div className="dropdown-menu" role="dialog" aria-label="Bildirishnomalar">
                <div className="notif-header">
                  <span>Bildirishnomalar</span>
                  {unreadCount > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
                      Barchasini o'qish
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={['notif-item', !n.read ? 'unread' : ''].join(' ')}
                      onClick={() => setNotifications(prev =>
                        prev.map(x => x.id === n.id ? { ...x, read: true } : x)
                      )}
                    >
                      <div>
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Round user avatar on the far right */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="topbar-avatar-btn"
              aria-label="Profil menyusi"
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            >
              <Avatar name={user?.name || 'User'} size="md" />
            </button>
            {profileOpen && (
              <div className="dropdown-menu" role="dialog" aria-label="Profil menyusi">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name || 'Mars Foydalanuvchisi'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email || 'user@marsit.uz'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: 4, fontWeight: 600 }}>
                    {adminMode || isAdmin ? 'Administrator' : (user?.group || 'Guruh biriktirilmagan')}
                  </div>
                </div>
                {adminMode || isAdmin ? (
                  <button className="dropdown-item" onClick={() => { navigate('/admin'); setProfileOpen(false); }}>
                    🛠 Admin panel
                  </button>
                ) : (
                  <button className="dropdown-item" onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                    👤 Mening profilim
                  </button>
                )}
                <button className="dropdown-item" onClick={() => { cycleTheme(); }}>
                  🎨 Mavzuni o'zgartirish ({currentTheme.label})
                </button>
                {!(adminMode || isAdmin) && (
                  <button className="dropdown-item" onClick={() => alert('Mars IT hisob sozlamalari')}>
                    ⚙️ Sozlamalar
                  </button>
                )}
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  🚪 Chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== SIDEBAR ===== */}
      {/* Positioned under the header on the left, white background, width ~340px, no logo */}
      <aside className={['sidebar', sidebarOpen ? 'open' : ''].join(' ')} aria-label="Asosiy navigatsiya">
        {/* Mobile slide-in drawer header */}
        <div className="sidebar-mobile-header">
          <Link to={homePath} onClick={() => setSidebarOpen(false)}>
            <img src="/mars-logo.png" alt="Mars" style={{ height: '36px', width: 'auto' }} />
          </Link>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end ?? item.path === '/'}
                className={({ isActive }) => ['sidebar-link', isActive ? 'active' : ''].join(' ')}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} className="sidebar-link-icon" />
                <span className="sidebar-link-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mascot at bottom of sidebar — 3D cartoon boy standing on the rock */}
        <div className="sidebar-mascot">
          <img
            src="/mascot.png"
            alt="Mars Mascot"
            className="sidebar-mascot-img"
          />
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content" role="main">
        <div className="page-container animate-fade-in">
          {children}
        </div>
      </main>

      {/* ===== BOTTOM NAV (mobile) ===== */}
      <nav className="bottom-nav" aria-label="Mobil navigatsiya">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end ?? item.path === '/'}
              className={({ isActive }) => ['bottom-nav-item', isActive ? 'active' : ''].join(' ')}
            >
              <Icon size={20} className="bottom-nav-icon" />
              <span>{item.shortLabel}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
