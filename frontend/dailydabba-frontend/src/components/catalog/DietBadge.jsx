const dietConfig = {
  VEG: { label: "Veg", classes: "bg-lime-100 text-lime-800 border border-lime-300" },
  NON_VEG: { label: "Non-Veg", classes: "bg-red-100 text-red-800 border border-red-300" },
  EGGETARIAN: { label: "Egg", classes: "bg-amber-100 text-amber-800 border border-amber-300" },
  VEGAN: { label: "Vegan", classes: "bg-emerald-100 text-emerald-800 border border-emerald-300" },
  JAIN: { label: "Jain", classes: "bg-indigo-100 text-indigo-800 border border-indigo-300" },
};

export default function DietBadge({ dietType, className = "" }) {
  if (!dietType) return null;
  const config = dietConfig[dietType] || { label: dietType, classes: "bg-surface text-ink-soft border border-ink/10" };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${config.classes} ${className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}
