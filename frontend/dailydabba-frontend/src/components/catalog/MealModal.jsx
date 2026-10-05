import { useEffect, useMemo, useState } from "react";
import { Check, IndianRupee, Loader2, Search, X } from "lucide-react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import DietBadge from "./DietBadge";
import FoodImageUpload from "./FoodImageUpload";
import { mealItemService } from "../../services/mealItemService";
import { mealService } from "../../services/mealService";

const DIET_RANKS = {
  NON_VEG: 5,
  EGGETARIAN: 4,
  VEG: 3,
  VEGAN: 2,
  JAIN: 1,
};

function computeUpperBoundDiet(selectedItems) {
  if (!selectedItems.length) return "VEG";
  let highest = "JAIN";
  let highestRank = 1;

  for (const item of selectedItems) {
    const type = item.dietType || "VEG";
    const rank = DIET_RANKS[type] || 3;
    if (rank > highestRank) {
      highestRank = rank;
      highest = type;
    }
  }
  return highest;
}

export default function MealModal({
  isOpen,
  onClose,
  onSuccess,
  initialMeal = null,
  preloadedMealItems = null,
  onRequestCreateItem,
}) {
  const isEdit = !!initialMeal;

  const [name, setName] = useState(initialMeal?.name || "");
  const [description, setDescription] = useState(initialMeal?.description || "");
  const [selectedIds, setSelectedIds] = useState(() => {
    if (initialMeal?.items && Array.isArray(initialMeal.items)) {
      return new Set(initialMeal.items.map((i) => i.id));
    }
    return new Set();
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl] = useState(initialMeal?.imageUrl || null);

  const [availableItems, setAvailableItems] = useState(preloadedMealItems || []);
  const [loadingItems, setLoadingItems] = useState(!preloadedMealItems);
  const [itemsError, setItemsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialMeal?.name || "");
      setDescription(initialMeal?.description || "");
      const itemsList = Array.isArray(initialMeal?.items)
        ? initialMeal.items
        : initialMeal?.items
        ? Array.from(initialMeal.items)
        : [];
      setSelectedIds(new Set(itemsList.map((i) => i.id)));
      setImageFile(null);
      setSearchQuery("");
      setErrors({});
      setServerError("");
    }
  }, [isOpen, initialMeal]);

  // Fetch available meal items if not preloaded
  useEffect(() => {
    if (!isOpen) return;

    if (preloadedMealItems && preloadedMealItems.length > 0) {
      setAvailableItems(preloadedMealItems);
      setLoadingItems(false);
      return;
    }

    let isCancelled = false;
    setLoadingItems(true);
    setItemsError("");

    mealItemService
      .getMealItems({ page: 0, size: 100 })
      .then((data) => {
        if (!isCancelled) {
          setAvailableItems(data?.content || []);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setItemsError(err.message || "Failed to load meal items.");
        }
      })
      .finally(() => {
        if (!isCancelled) setLoadingItems(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, preloadedMealItems]);

  // Compute upper-bound diet type from selected items
  const selectedItemsList = useMemo(() => {
    return availableItems.filter((item) => selectedIds.has(item.id));
  }, [availableItems, selectedIds]);

  const computedDietType = useMemo(() => {
    return computeUpperBoundDiet(selectedItemsList);
  }, [selectedItemsList]);

  const totalPrice = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [selectedItemsList]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return availableItems;
    const q = searchQuery.toLowerCase().trim();
    return availableItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [availableItems, searchQuery]);

  if (!isOpen) return null;

  const toggleItem = (itemId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
    if (errors.mealItemIds) {
      setErrors((prev) => ({ ...prev, mealItemIds: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Meal name is required.";
    } else if (name.trim().length > 120) {
      errs.name = "Meal name must not exceed 120 characters.";
    }

    if (description && description.trim().length > 500) {
      errs.description = "Description must not exceed 500 characters.";
    }

    if (selectedIds.size === 0) {
      errs.mealItemIds = "Select at least one meal item for this meal.";
    }

    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      errs.image = "Image must be smaller than 2 MB.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        mealItemIds: Array.from(selectedIds),
        image: imageFile,
      };

      if (isEdit) {
        await mealService.updateMeal(initialMeal.id, payload);
      } else {
        await mealService.createMeal(payload);
      }

      onSuccess?.(isEdit ? "Meal updated successfully" : "Meal created successfully");
      onClose();
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
      setServerError(err.message || "Failed to save meal. Please review and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-modal-title"
    >
      <div className="relative my-8 w-full max-w-lg rounded-3xl bg-surface p-6 shadow-neu sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <h2 id="meal-modal-title" className="text-xl font-extrabold text-ink">
            {isEdit ? "Edit Meal" : "Create Meal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
          {serverError && <Alert>{serverError}</Alert>}

          {/* Meal Name */}
          <div>
            <label htmlFor="meal-name" className="mb-2 block text-sm font-semibold text-ink">
              Meal Name
            </label>
            <input
              id="meal-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Regular Lunch, Deluxe Dinner, Special Thali"
              maxLength={120}
              className={`w-full rounded-xl bg-surface px-4 py-3 text-sm shadow-neu-inset outline-none transition-all placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 ${
                errors.name ? "ring-2 ring-danger/50" : ""
              }`}
            />
            {errors.name && <p className="mt-1.5 text-xs font-medium text-danger">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="meal-description" className="mb-2 block text-sm font-semibold text-ink">
              Description
            </label>
            <textarea
              id="meal-description"
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Brief description of this meal / tiffin combination..."
              maxLength={500}
              className={`w-full resize-y rounded-xl bg-surface px-4 py-3 text-sm shadow-neu-inset outline-none transition-all placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 ${
                errors.description ? "ring-2 ring-danger/50" : ""
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-danger">{errors.description}</p>
            )}
          </div>

          {/* Diet Type (Auto-inferred with visual badge) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">Diet Type</label>
              <span className="text-xs text-ink-soft">Calculated from items</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-neu-inset">
              <span className="text-sm font-bold text-ink">Meal Category</span>
              <DietBadge dietType={computedDietType} />
            </div>
          </div>

          {/* Meal Items Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">Meal Items</label>
              <span className="text-xs font-bold text-lime-600">
                Selected: {selectedIds.size} {selectedIds.size === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Search items */}
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meal items..."
                className="w-full rounded-xl bg-surface py-2.5 pl-10 pr-4 text-xs shadow-neu-inset outline-none transition-all placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70"
              />
            </div>

            {/* Items Checklist Box */}
            <div className="max-h-52 overflow-y-auto rounded-2xl bg-surface p-2 shadow-neu-inset">
              {loadingItems && (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-ink-soft">
                  <Loader2 className="h-4 w-4 animate-spin text-lime-600" />
                  Loading meal items...
                </div>
              )}

              {!loadingItems && itemsError && (
                <div className="p-3 text-xs text-danger">{itemsError}</div>
              )}

              {!loadingItems && !itemsError && availableItems.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-xs text-ink-soft">No meal items found in your catalog.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestCreateItem?.();
                    }}
                    className="mt-2 text-xs font-bold text-lime-600 underline hover:text-lime-700"
                  >
                    + Create a meal item first
                  </button>
                </div>
              )}

              {!loadingItems && !itemsError && availableItems.length > 0 && (
                <div className="space-y-1">
                  {filteredItems.length === 0 ? (
                    <p className="py-4 text-center text-xs text-ink-soft">
                      No matching meal items found.
                    </p>
                  ) : (
                    filteredItems.map((item) => {
                      const isChecked = selectedIds.has(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                              e.preventDefault();
                              toggleItem(item.id);
                            }
                          }}
                          className={`flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all select-none ${
                            isChecked
                              ? "bg-lime-400/20 font-bold text-ink"
                              : "hover:bg-ink/5 text-ink"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                isChecked
                                  ? "border-lime-600 bg-lime-500 text-white shadow-neu-sm"
                                  : "border-ink/20 bg-surface shadow-neu-inset"
                              }`}
                            >
                              {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold">{item.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <DietBadge dietType={item.dietType} />
                            <span className="text-xs font-bold text-ink-soft">
                              ₹{Number(item.price).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Price and count summary */}
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-ink-soft">
                Selected: <strong className="text-ink">{selectedIds.size} items</strong>
              </span>
              <span className="font-bold text-ink">
                Combined price: <span className="text-lime-600 font-extrabold">₹{totalPrice.toFixed(2)}</span>
              </span>
            </div>

            {errors.mealItemIds && (
              <p className="mt-1 text-xs font-medium text-danger">{errors.mealItemIds}</p>
            )}
          </div>

          {/* Meal Photo */}
          <FoodImageUpload
            label="Image"
            promptText="Upload Meal Image"
            file={imageFile}
            currentImageUrl={currentImageUrl}
            onChange={(file) => {
              setImageFile(file);
              if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
            }}
            error={errors.image}
          />

          {/* Modal Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-ink/10 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl bg-surface px-5 py-2.5 text-sm font-bold text-ink shadow-neu-sm transition-all hover:shadow-neu active:shadow-neu-pressed disabled:opacity-50"
            >
              Cancel
            </button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "Save Changes" : "Create Meal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
