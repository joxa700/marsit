export default function AdminModal({ title, onClose, children, footer, wide = false }) {
  return (
    <div
      className="admin-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`admin-modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-modal-header">
          <span>{title}</span>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Yopish">
            ×
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
