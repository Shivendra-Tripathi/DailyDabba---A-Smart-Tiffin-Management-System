import { Package, Pencil, Trash2 } from "lucide-react";
import DietBadge from "./DietBadge";

export default function MealCard({ meal, onEdit, onDelete }) {
  const items = Array.isArray(meal.items) ? meal.items : meal.items ? Array.from(meal.items) : [];
  const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-surface p-4 shadow-neu transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
      {/* Top Media & Badges */}
      <div>
        <div className="relative mb-3.5 h-40 w-full overflow-hidden rounded-2xl bg-surface shadow-neu-inset">
          {meal.imageUrl ? (
            <img
              src={meal.imageUrl}
              alt={meal.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-ink-soft/60">
              <Package className="h-8 w-8 stroke-[1.5]" aria-hidden="true" />
              <span className="mt-1 text-xs font-semibold">No photo</span>
            </div>
          )}
          <div className="absolute right-2.5 top-2.5">
            <DietBadge dietType={meal.mealType} />
          </div>
        </div>

        {/* Name and Price/Item count */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-1 text-base font-extrabold text-ink" title={meal.name}>
              {meal.name}
            </h3>
            <span className="text-xs font-semibold text-lime-600">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          {totalPrice > 0 && (
            <span className="shrink-0 text-base font-extrabold text-ink">
              ₹{totalPrice.toFixed(0)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-ink-soft">
          {meal.description || "No description provided."}
        </p>

        {/* Included Items Pills */}
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
            Includes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {items.length === 0 ? (
              <span className="text-xs text-ink-soft italic">No items attached</span>
            ) : (
              items.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center rounded-lg bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink shadow-neu-inset"
                >
                  {item.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-ink/10 pt-3">
        <button
          type="button"
          onClick={() => onDelete(meal)}
          aria-label={`Delete ${meal.name}`}
          className="inline-flex items-center justify-center rounded-xl p-2 text-ink-soft transition-colors hover:bg-danger/10 hover:text-danger active:shadow-neu-pressed"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(meal)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-neu-sm transition-all hover:bg-lime-400 hover:shadow-neu active:shadow-neu-pressed"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
      </div>
    </div>
  );
}
