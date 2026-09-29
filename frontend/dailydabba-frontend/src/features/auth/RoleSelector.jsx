import { User, Store } from "lucide-react";

// Values MUST match the backend's role names.
const ROLES = [
  { value: "CUSTOMER", label: "Customer", description: "Find and manage tiffins", icon: User },
  { value: "VENDOR", label: "Vendor", description: "Run a tiffin service", icon: Store },
];

// Two big radio cards. Selected one looks pressed-in with the accent tint.
export default function RoleSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">I am a</legend>
      <div className="grid grid-cols-2 gap-4">
        {ROLES.map(({ value: v, label, description, icon: Icon }) => (
          <label key={v} className="cursor-pointer">
            <input type="radio" name="role" value={v} checked={value === v} onChange={onChange} className="peer sr-only" />
            <span className="flex h-full flex-col gap-1 rounded-xl bg-surface p-4 shadow-neu-sm transition-all duration-200 peer-checked:bg-lime-100 peer-checked:shadow-neu-pressed peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-lime-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-bold">{label}</span>
              <span className="text-xs text-ink-soft">{description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
