import { UtensilsCrossed } from "lucide-react";

// Brand mark. Reused by every layout/navbar later.
export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 shadow-neu-sm">
        <UtensilsCrossed className="h-5 w-5 text-ink" aria-hidden="true" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">DailyDabba</span>
    </div>
  );
}
