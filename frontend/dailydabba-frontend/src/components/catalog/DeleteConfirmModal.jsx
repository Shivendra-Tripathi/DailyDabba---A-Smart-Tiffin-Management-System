import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName = "",
  itemType = "meal item",
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface p-6 shadow-neu sm:p-8">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="delete-modal-title" className="text-lg font-extrabold text-ink">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="my-5 space-y-2">
          <p className="text-sm text-ink-soft">
            Are you sure you want to delete this {itemType}?
          </p>
          {itemName && (
            <p className="rounded-xl bg-surface p-3 font-semibold text-ink shadow-neu-inset">
              "{itemName}"
            </p>
          )}
          <p className="text-xs text-danger">
            This will remove it from your active catalog.
          </p>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 pt-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl bg-surface px-5 py-2.5 text-sm font-bold text-ink shadow-neu-sm transition-all hover:shadow-neu active:shadow-neu-pressed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-5 py-2.5 text-sm font-bold text-white shadow-neu-sm transition-all hover:bg-danger/90 active:shadow-neu-pressed disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
