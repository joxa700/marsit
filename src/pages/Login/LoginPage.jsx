// LoginPage — Mars IT ta'lim platformasiga kirish sahifasi
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/**
 * Fon uchun yulduzlar to'dasi (constellation) animatsiya komponenti.
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

    const mouse = { x: -1000, y: -1000, radius: 130 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

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

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0) dot.x = w;
        else if (dot.x > w) dot.x = 0;
        if (dot.y < 0) dot.y = h;
        else if (dot.y > h) dot.y = 0;

        const dxMouse = mouse.x - dot.x;
        const dyMouse = mouse.y - dot.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius) {
          const force = (1 - distMouse / mouse.radius) * 0.5;
          dot.x -= (dxMouse / distMouse) * force;
          dot.y -= (dyMouse / distMouse) * force;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(190, 215, 255, 0.8)';
        ctx.fill();

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
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError('');
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setValidationError('Email manzilingizni kiriting');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Email formati noto'g'ri (masalan: user@marsit.uz)");
      return;
    }
    if (!password) {
      setValidationError('Parolni kiriting');
      return;
    }

    const loggedUser = await login(trimmedEmail, password);
    if (loggedUser) {
      navigate(loggedUser.role === 'admin' ? '/admin' : '/');
    }
  }

  const isFilled = email.trim() !== '' && password !== '';
  const isButtonDisabled = loading || !isFilled;
  const displayError = validationError || error;

  return (
    <div className="login-root">
      <ConstellationCanvas />

      <h1 className="login-pixel-title">MARS IT</h1>

      <div className="login-glass-card">
        <button
          type="button"
          className="login-offerta-link"
          onClick={() => alert("Mars IT platformasidan foydalanish shartlari va ommaviy oferta.")}
        >
          Offerta
        </button>

        <div className="login-card-header">
          <h2 className="login-heading">SPACEGA XUSH KELIBSIZ</h2>
          <p className="login-subheading">Akkauntingizga kiring</p>
        </div>

        {displayError && (
          <div className="login-error-alert" role="alert">
            {displayError}
          </div>
        )}

        <form className="login-form-body login-tab-animated" onSubmit={handleSubmit} noValidate>
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
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
                type={showPassword ? 'text' : 'password'}
                className="login-input-element"
                placeholder="Parolni kiriting"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setValidationError('');
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
      </div>
    </div>
  );
}
