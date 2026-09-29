import { AlertCircle, CheckCircle2 } from "lucide-react";

// Banner for form-level messages. variant: "error" | "success"
const styles = {
  error: { box: "bg-danger/10 text-danger", Icon: AlertCircle },
  success: { box: "bg-lime-100 text-ink", Icon: CheckCircle2 },
};

export default function Alert({ variant = "error", children }) {
  const { box, Icon } = styles[variant];
  return (
    <div role={variant === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-xl p-4 text-sm font-medium ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
