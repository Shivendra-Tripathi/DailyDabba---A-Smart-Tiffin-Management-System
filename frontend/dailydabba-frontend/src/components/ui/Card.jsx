// Raised neumorphic surface. Use for every card/panel so they all look the same.
export default function Card({ children, className = "" }) {
  return <div className={`rounded-3xl bg-surface p-6 shadow-neu sm:p-8 ${className}`}>{children}</div>;
}
