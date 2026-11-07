// LoginPage — Mars IT ta'lim platformasi kirish va ro'yxatdan o'tish sahifasi
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/**
 * Fon uchun yulduzlar to'dasi (constellation) animatsiya komponenti.
 * Canvas orqali yulduzlar harakatlanadi, yaqin nuqtalar orasiga nozik chiziqlar tortiladi
 * va sichqoncha yaqinlashganda unga qarab reaksiyaga kirishadi.
 */
function ConstellationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Sichqoncha koordinatalari
    const mouse = { x: -1000, y: -1000, radius: 130 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Nuqtalar (yulduzlar) ro'yxati
    const dots = [];
    function initDots() {
      dots.length = 0;
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1.2,
        });
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    initDots();

    // Animatsiya sikli
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Ekran chegarasidan qaytarish
        if (dot.x < 0) dot.x = w;
        else if (dot.x > w) dot.x = 0;
        if (dot.y < 0) dot.y = h;
        else if (dot.y > h) dot.y = 0;

        // Sichqoncha yaqin kelsa itarish effekti
        const dxMouse = mouse.x - dot.x;
        const dyMouse = mouse.y - dot.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius) {
          const force = (1 - distMouse / mouse.radius) * 0.5;
          dot.x -= (dxMouse / distMouse) * force;
          dot.y -= (dyMouse / distMouse) * force;
        }

        // Yulduzni chizish (glow effekti bilan)
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(190, 215, 255, 0.8)';
        ctx.fill();

        // Yaqin nuqtalar orasiga chiziq tortish
        for (let j = i + 1; j < dots.length; j++) {
          const dot2 = dots[j];
          const dx = dot.x - dot2.x;
          const dy = dot.y - dot2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * 0.24;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.strokeStyle = `rgba(160, 195, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Komponent unmount bo'lganda tozalash
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="login-canvas" />;
}

export default function LoginPage() {
  const { login, register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  // Tab holati: 'login' (Kirish) yoki 'register' (Ro'yxatdan o'tish)
  const [activeTab, setActiveTab] = useState('login');

  // Kirish formasi holatlari
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Ro'yxatdan o'tish formasi holatlari
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  // Lokal validatsiya xatosi
  const [validationError, setValidationError] = useState('');

  // Email formatini tekshirish uchun regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Tabni almashtirish
  function handleTabChange(tab) {
    setActiveTab(tab);
    setError('');
    setValidationError('');
  }

  // Kirish formasi submit qilinganda
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setValidationError('');
    setError('');

    const trimmedEmail = loginEmail.trim();

    if (!trimmedEmail) {
      setValidationError('Email manzilingizni kiriting');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Email formati noto'g'ri (masalan: user@marsit.uz)");
      return;
    }
    if (!loginPassword) {
      setValidationError('Parolni kiriting');
      return;
    }

    const ok = await login(trimmedEmail, loginPassword);
    if (ok) {
      navigate('/');
    }
  }

  // Ro'yxatdan o'tish submit qilinganda
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setValidationError('');
    setError('');

    const trimmedEmail = registerEmail.trim();

    if (!trimmedEmail) {
      setValidationError('Email manzilingizni kiriting');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Email formati noto'g'ri (masalan: user@marsit.uz)");
      return;
    }
    if (!registerPassword) {
      setValidationError('Parolni kiriting');
      return;
    }
    if (registerPassword.length < 6) {
      setValidationError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setValidationError('Parollar mos kelmadi');
      return;
    }

    const ok = await register({
      email: trimmedEmail,
      password: registerPassword,
      name: registerName,
    });

    if (ok) {
      navigate('/');
    }
  }

  // Maydonlar to'ldirilganligini aniqlash (tugma xiralashishi uchun)
  const isLoginFilled = loginEmail.trim() !== '' && loginPassword !== '';
  const isRegisterFilled =
    registerEmail.trim() !== '' &&
    registerPassword !== '' &&
    registerConfirmPassword !== '';

  const isButtonDisabled =
    loading || (activeTab === 'login' ? !isLoginFilled : !isRegisterFilled);

  const displayError = validationError || error;

  return (
    <div className="login-root">
      {/* Orqa fon yulduzlar animatsiyasi */}
      <ConstellationCanvas />

      {/* Tepada piksel/dotted shriftda MARS IT nomi */}
      <h1 className="login-pixel-title">MARS IT</h1>

      {/* Asosiy glassmorphism karta */}
      <div className="login-glass-card">
        {/* Yuqori chap burchakda Offerta matni */}
        <button
          type="button"
          className="login-offerta-link"
          onClick={() => alert("Mars IT platformasidan foydalanish shartlari va ommaviy oferta.")}
        >
          Offerta
        </button>

        {/* Karta sarlavhasi */}
        <div className="login-card-header">
          <h2 className="login-heading">SPACEGA XUSH KELIBSIZ</h2>
          <p className="login-subheading">Bugun nimani o'rganamiz?</p>
        </div>

        {/* Kirish / Ro'yxatdan o'tish tablari */}
        <div className="login-tabs-container" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'login'}
            className={`login-tab-pill ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Kirish
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'register'}
            className={`login-tab-pill ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Xatolik xabari */}
        {displayError && (
          <div className="login-error-alert" role="alert">
            {displayError}
          </div>
        )}

        {/* Tab 1: KIRISH (Login) */}
        {activeTab === 'login' && (
          <form
            key="login-form"
            className="login-form-body login-tab-animated"
            onSubmit={handleLoginSubmit}
            noValidate
          >
            <div className="login-input-group">
              <label className="login-label" htmlFor="login-email">
                EMAIL
              </label>
              <div className="login-input-wrap">
                <Mail className="login-left-icon" size={18} />
                <input
                  id="login-email"
                  type="email"
                  className="login-input-element"
                  placeholder="name@marsit.uz"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setError('');
                    setValidationError('');
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="login-password">
                PAROL
              </label>
              <div className="login-input-wrap">
                <Lock className="login-left-icon" size={18} />
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  className="login-input-element"
                  placeholder="Parolni kiriting"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setError('');
                    setValidationError('');
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-toggle"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  aria-label={showLoginPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`login-main-submit-btn ${isButtonDisabled ? 'disabled' : ''}`}
            >
              {loading ? (
                <span className="login-btn-loading-content">
                  <span className="login-mini-spinner" />
                  Yuklanmoqda...
                </span>
              ) : (
                'Kirish'
              )}
            </button>
          </form>
        )}

        {/* Tab 2: RO'YXATDAN O'TISH (Register) */}
        {activeTab === 'register' && (
          <form
            key="register-form"
            className="login-form-body login-tab-animated"
            onSubmit={handleRegisterSubmit}
            noValidate
          >
            <div className="login-input-group">
              <label className="login-label" htmlFor="register-name">
                ISM (IXTIYORIY)
              </label>
              <div className="login-input-wrap">
                <User className="login-left-icon" size={18} />
                <input
                  id="register-name"
                  type="text"
                  className="login-input-element"
                  placeholder="Ismingizni kiriting"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="register-email">
                EMAIL
              </label>
              <div className="login-input-wrap">
                <Mail className="login-left-icon" size={18} />
                <input
                  id="register-email"
                  type="email"
                  className="login-input-element"
                  placeholder="name@marsit.uz"
                  value={registerEmail}
                  onChange={(e) => {
                    setRegisterEmail(e.target.value);
                    setError('');
                    setValidationError('');
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="register-password">
                PAROL
              </label>
              <div className="login-input-wrap">
                <Lock className="login-left-icon" size={18} />
                <input
                  id="register-password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  className="login-input-element"
                  placeholder="Kamida 6 ta belgi"
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                    setError('');
                    setValidationError('');
                  }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-eye-toggle"
                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                  aria-label={showRegisterPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="register-confirm-password">
                PAROLNI TASDIQLASH
              </label>
              <div className="login-input-wrap">
                <Lock className="login-left-icon" size={18} />
                <input
                  id="register-confirm-password"
                  type={showRegisterConfirm ? 'text' : 'password'}
                  className="login-input-element"
                  placeholder="Parolni qayta kiriting"
                  value={registerConfirmPassword}
                  onChange={(e) => {
                    setRegisterConfirmPassword(e.target.value);
                    setError('');
                    setValidationError('');
                  }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-eye-toggle"
                  onClick={() => setShowRegisterConfirm((prev) => !prev)}
                  aria-label={showRegisterConfirm ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                >
                  {showRegisterConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`login-main-submit-btn ${isButtonDisabled ? 'disabled' : ''}`}
            >
              {loading ? (
                <span className="login-btn-loading-content">
                  <span className="login-mini-spinner" />
                  Yuklanmoqda...
                </span>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Karta ostidagi havola */}
      <div className="login-bottom-toggle">
        {activeTab === 'login' ? (
          <button
            type="button"
            className="login-bottom-toggle-btn"
            onClick={() => handleTabChange('register')}
          >
            Akkauntga ega emasmisiz?{' '}
            <span className="login-highlight-link">Ro'yxatdan o'tish</span>
          </button>
        ) : (
          <button
            type="button"
            className="login-bottom-toggle-btn"
            onClick={() => handleTabChange('login')}
          >
            Akkauntingiz bormi?{' '}
            <span className="login-highlight-link">Kirish</span>
          </button>
        )}
      </div>
    </div>
  );
}
