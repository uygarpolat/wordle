export default function Button({ children, color, onClick, ariaLabel }) {
  const variant = color ?? "default";

  return (
    <button
      type="button"
      className={`button button-${variant}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}