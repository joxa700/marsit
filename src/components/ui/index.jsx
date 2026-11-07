// Shared UI Components
import './ui.css';

/** Primary button */
export function Button({ children, variant = 'accent', size, block, className = '', ...props }) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    className,
  ].filter(Boolean).join(' ');
  return <button className={cls} {...props}>{children}</button>;
}

/** Card wrapper */
export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div className={['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={['card-body', className].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={['card-header', className].filter(Boolean).join(' ')}>{children}</div>;
}

/** Progress bar */
export function ProgressBar({ value = 0, max = 100, label, variant, color, showPercent = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress-wrap">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="progress-bar-bg">
        <div
          className={['progress-bar-fill', variant || ''].join(' ')}
          style={{ width: `${pct}%`, ...(color ? { background: color } : {}) }}
        />
      </div>
    </div>
  );
}

/** Badge */
export function Badge({ children, variant = 'accent', className = '' }) {
  return (
    <span className={['badge', `badge-${variant}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}

/** Tabs */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-wrap" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={['tab-item', active === tab.id ? 'active' : ''].join(' ')}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** Avatar */
export function Avatar({ name = '', src = null, size = 'md', className = '' }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={['avatar', `avatar-${size}`, className].filter(Boolean).join(' ')}>
      {src ? <img src={src} alt={name} /> : initials || '?'}
    </div>
  );
}

/** Ring / circular progress */
export function RingProgress({ value = 0, max = 100, size = 80, strokeWidth = 7, color = '#1e9bff', children }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="ring-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="bg" cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} />
        <circle
          className="fill"
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ stroke: color }}
        />
      </svg>
      <div className="ring-progress-label">{children || `${Math.round(pct)}%`}</div>
    </div>
  );
}

/** Stat chip for topbar */
export function StatChip({ icon, value, label, animating, style }) {
  return (
    <div className={['stat-chip', animating ? 'animating' : ''].join(' ')} title={label} style={style}>
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

