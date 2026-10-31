// Small label + input/textarea wrapper
export default function Field({ label, hint, multiline, rows = 4, className = "", ...props }) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {hint && <span className="field__hint">{hint}</span>}
      </span>
      {multiline ? (
        <textarea className={`input ${className}`} rows={rows} {...props} />
      ) : (
        <input className={`input ${className}`} {...props} />
      )}
    </label>
  );
}
