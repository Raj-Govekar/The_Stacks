export function Label({ children, className = "" }) {
  return <label className={`text-sm font-medium text-ink ${className}`}>{children}</label>;
}
