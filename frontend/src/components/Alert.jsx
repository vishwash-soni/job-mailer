export default function Alert({ type = "error", onClose, children }) {
  return (
    <div className={`alert alert--${type}`} role="alert">
      <span>{children}</span>
      <button className="alert__close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}
