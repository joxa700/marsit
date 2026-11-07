// Mars Robot/Astronaut Mascot SVG — original Mars-themed robot character
export default function MascotSVG() {
  return (
    <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="28" y="60" width="44" height="40" rx="10" fill="#6366f1" />
      {/* Body panel lines */}
      <rect x="38" y="70" width="24" height="12" rx="4" fill="rgba(255,255,255,0.15)" />
      {/* Belt */}
      <rect x="28" y="92" width="44" height="6" rx="2" fill="#4f46e5" />
      {/* Arms */}
      <rect x="10" y="62" width="16" height="8" rx="4" fill="#6366f1" />
      <rect x="74" y="62" width="16" height="8" rx="4" fill="#6366f1" />
      {/* Hands */}
      <circle cx="10" cy="66" r="5" fill="#818cf8" />
      <circle cx="90" cy="66" r="5" fill="#818cf8" />
      {/* Helmet */}
      <ellipse cx="50" cy="42" rx="22" ry="24" fill="#818cf8" />
      {/* Visor */}
      <ellipse cx="50" cy="40" rx="16" ry="17" fill="#1e1b4b" />
      {/* Visor shine */}
      <ellipse cx="44" cy="34" rx="5" ry="7" fill="rgba(255,255,255,0.12)" />
      {/* Eyes */}
      <circle cx="44" cy="38" r="4" fill="#00ffcc" />
      <circle cx="56" cy="38" r="4" fill="#00ffcc" />
      <circle cx="45" cy="37" r="1.5" fill="#fff" />
      <circle cx="57" cy="37" r="1.5" fill="#fff" />
      {/* Antenna */}
      <line x1="50" y1="18" x2="50" y2="28" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="15" r="4" fill="#f59e0b" />
      <circle cx="50" cy="15" r="2" fill="#fbbf24" />
      {/* Helmet ring */}
      <ellipse cx="50" cy="66" rx="22" ry="4" fill="#6366f1" />
      {/* Legs */}
      <rect x="34" y="100" width="12" height="20" rx="4" fill="#4f46e5" />
      <rect x="54" y="100" width="12" height="20" rx="4" fill="#4f46e5" />
      {/* Feet */}
      <rect x="30" y="116" width="18" height="8" rx="4" fill="#6366f1" />
      <rect x="52" y="116" width="18" height="8" rx="4" fill="#6366f1" />
      {/* Stars decoration */}
      <circle cx="22" cy="40" r="1.5" fill="#fbbf24" opacity="0.6" />
      <circle cx="78" cy="30" r="1" fill="#fbbf24" opacity="0.6" />
      <circle cx="80" cy="50" r="1.5" fill="#fbbf24" opacity="0.4" />
    </svg>
  );
}

