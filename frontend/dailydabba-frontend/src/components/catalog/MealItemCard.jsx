import { Pencil, Trash2, Utensils } from "lucide-react";
import DietBadge from "./DietBadge";

export default function MealItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-surface p-4 shadow-neu transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
      {/* Top Media & Badges */}
      <div>
        <div className="relative mb-3.5 h-40 w-full overflow-hidden rounded-2xl bg-surface shadow-neu-inset">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-ink-soft/60">
              <Utensils className="h-8 w-8 stroke-[1.5]" aria-hidden="true" />
              <span className="mt-1 text-xs font-semibold">No photo</span>
            </div>
          )}
          <div className="absolute right-2.5 top-2.5">
            <DietBadge dietType={item.dietType} />
          </div>
        </div>

        {/* Name and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-extrabold text-ink" title={item.name}>
            {item.name}
          </h3>
          <span className="shrink-0 text-base font-extrabold text-ink">
            ₹{Number(item.price).toFixed(0)}
          </span>
        </div>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-ink-soft">
          {item.description || "No description provided."}
        </p>
      </div>

      {/* Card Actions */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-ink/10 pt-3">
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label={`Delete ${item.name}`}
          className="inline-flex items-center justify-center rounded-xl p-2 text-ink-soft transition-colors hover:bg-danger/10 hover:text-danger active:shadow-neu-pressed"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-neu-sm transition-all hover:bg-lime-400 hover:shadow-neu active:shadow-neu-pressed"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
      </div>
    </div>
  );
}
