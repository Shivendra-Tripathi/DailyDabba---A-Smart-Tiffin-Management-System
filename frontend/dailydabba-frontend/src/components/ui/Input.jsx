import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Inset (pressed-in) text field with label, optional left icon, error text, and a show/hide toggle for passwords.
// Usage: <Input label="Email" icon={Mail} name="email" value=... onChange=... error="..." />
export default function Input({ label, error, hint, icon: Icon, type = "text", className = "", ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />}
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={
            "w-full rounded-xl bg-surface py-3 text-sm shadow-neu-inset outline-none transition-all duration-200 " +
            "placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 " +
            `${Icon ? "pl-11" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"} ${error ? "ring-2 ring-danger/50" : ""}`
          }
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-soft transition-all duration-200 hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? <p id={errorId} className="mt-2 text-xs font-medium text-danger">{error}</p>
             : hint && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
