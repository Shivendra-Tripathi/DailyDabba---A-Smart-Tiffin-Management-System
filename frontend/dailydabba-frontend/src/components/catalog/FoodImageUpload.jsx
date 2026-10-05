import { useEffect, useId, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

export default function FoodImageUpload({
  label = "Image",
  promptText = "Upload Image",
  file,
  currentImageUrl,
  onChange,
  error,
}) {
  const id = useId();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = previewUrl || currentImageUrl;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    onChange(selected);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink">{label}</label>

      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-ink/15 bg-surface p-4 transition-colors hover:border-lime-500/60">
        {displayUrl ? (
          <div className="relative flex flex-col items-center gap-3 sm:flex-row">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface shadow-neu-inset sm:h-32 sm:w-32">
              <img
                src={displayUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col items-start gap-2">
              <p className="text-xs font-semibold text-ink-soft">
                {file ? file.name : "Current image"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={id}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-neu-sm transition-all hover:shadow-neu active:shadow-neu-pressed"
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  Change image
                  <input
                    id={id}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink-soft shadow-neu-sm">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-ink">{promptText}</p>
            <p className="mt-1 text-xs text-ink-soft">JPG, PNG or WebP, up to 2 MB</p>
            <label
              htmlFor={id}
              className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-ink shadow-neu-sm transition-all hover:bg-lime-500 active:shadow-neu-pressed"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Choose File
              <input
                id={id}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
