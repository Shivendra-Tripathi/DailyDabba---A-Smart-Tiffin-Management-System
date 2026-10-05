import { useEffect, useState } from "react";
import { IndianRupee, X } from "lucide-react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import FoodImageUpload from "./FoodImageUpload";
import { mealItemService } from "../../services/mealItemService";

const DIET_OPTIONS = [
  { value: "VEG", label: "Vegetarian" },
  { value: "NON_VEG", label: "Non-Vegetarian" },
  { value: "EGGETARIAN", label: "Eggetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "JAIN", label: "Jain" },
];

export default function MealItemModal({ isOpen, onClose, onSuccess, initialItem = null }) {
  const isEdit = !!initialItem;

  const [name, setName] = useState(initialItem?.name || "");
  const [description, setDescription] = useState(initialItem?.description || "");
  const [dietType, setDietType] = useState(initialItem?.dietType || "VEG");
  const [price, setPrice] = useState(initialItem?.price != null ? String(initialItem.price) : "");
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl] = useState(initialItem?.imageUrl || null);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialItem?.name || "");
      setDescription(initialItem?.description || "");
      setDietType(initialItem?.dietType || "VEG");
      setPrice(initialItem?.price != null ? String(initialItem.price) : "");
      setImageFile(null);
      setErrors({});
      setServerError("");
    }
  }, [isOpen, initialItem]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Meal item name is required.";
    } else if (name.trim().length > 120) {
      errs.name = "Name must not exceed 120 characters.";
    }

    if (description && description.trim().length > 500) {
      errs.description = "Description must not exceed 500 characters.";
    }

    if (!dietType) {
      errs.dietType = "Please select a diet type.";
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      errs.price = "Enter a valid price greater than 0.";
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
        dietType,
        price: parseFloat(price),
        image: imageFile,
      };

      if (isEdit) {
        await mealItemService.updateMealItem(initialItem.id, payload);
      } else {
        await mealItemService.createMealItem(payload);
      }

      onSuccess?.(isEdit ? "Meal item updated successfully" : "Meal item created successfully");
      onClose();
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
      setServerError(err.message || "Failed to save meal item. Please check the form and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-item-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-surface p-6 shadow-neu sm:p-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <h2 id="meal-item-modal-title" className="text-xl font-extrabold text-ink">
            {isEdit ? "Edit Meal Item" : "Create Meal Item"}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
          {serverError && <Alert>{serverError}</Alert>}

          {/* Name Field */}
          <div>
            <label htmlFor="item-name" className="mb-2 block text-sm font-semibold text-ink">
              Name
            </label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Paneer Curry, Dal Tadka, Roti"
              maxLength={120}
              className={`w-full rounded-xl bg-surface px-4 py-3 text-sm shadow-neu-inset outline-none transition-all placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 ${
                errors.name ? "ring-2 ring-danger/50" : ""
              }`}
            />
            {errors.name && <p className="mt-1.5 text-xs font-medium text-danger">{errors.name}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="item-description" className="mb-2 block text-sm font-semibold text-ink">
              Description
            </label>
            <textarea
              id="item-description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Brief description of the meal item..."
              maxLength={500}
              className={`w-full resize-y rounded-xl bg-surface px-4 py-3 text-sm shadow-neu-inset outline-none transition-all placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 ${
                errors.description ? "ring-2 ring-danger/50" : ""
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-danger">{errors.description}</p>
            )}
          </div>

          {/* Diet Type & Price Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="item-diet-type" className="mb-2 block text-sm font-semibold text-ink">
                Diet Type
              </label>
              <div className="relative">
                <select
                  id="item-diet-type"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full appearance-none rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-neu-inset outline-none transition-all focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70"
                >
                  {DIET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-soft">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="item-price" className="mb-2 block text-sm font-semibold text-ink">
                Price
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
                  <IndianRupee className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="item-price"
                  type="number"
                  step="0.5"
                  min="0.01"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  placeholder="80.00"
                  className={`w-full rounded-xl bg-surface py-3 pl-10 pr-4 text-sm font-semibold shadow-neu-inset outline-none transition-all placeholder:text-ink-soft/70 focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 ${
                    errors.price ? "ring-2 ring-danger/50" : ""
                  }`}
                />
              </div>
              {errors.price && <p className="mt-1.5 text-xs font-medium text-danger">{errors.price}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <FoodImageUpload
            label="Image"
            promptText="Upload Meal Item Image"
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
              {isEdit ? "Save Changes" : "Create Meal Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

