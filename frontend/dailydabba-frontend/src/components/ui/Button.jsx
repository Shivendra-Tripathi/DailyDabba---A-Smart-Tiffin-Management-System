import { Loader2 } from "lucide-react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 " +
  "active:shadow-neu-pressed disabled:cursor-not-allowed disabled:opacity-60";
const variants = {
  primary: "bg-lime-400 text-ink shadow-neu-sm hover:bg-lime-500",   // main call-to-action
  secondary: "bg-surface text-ink shadow-neu-sm hover:shadow-neu",    // less important actions
};

// <Button loading={isSubmitting} fullWidth>Sign in</Button>
export default function Button({ children, variant = "primary", loading = false, fullWidth = false, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={loading || props.disabled}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
