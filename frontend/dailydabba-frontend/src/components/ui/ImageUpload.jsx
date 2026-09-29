import { useEffect, useId, useState } from "react";
import { ImagePlus, X } from "lucide-react";

// Profile picture picker with preview. `file` is a File object (or null); onChange(file) reports changes.
export default function ImageUpload({ label, file, onChange, onTouched, error }) {
  const id = useId();
  const [previewUrl, setPreviewUrl] = useState(null);

  // Build a temporary preview URL and free it when the file changes.
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (e) => {
    onChange(e.target.files[0] || null);
    onTouched?.();
    e.target.value = ""; // allows re-picking the same file
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface shadow-neu-inset">
          {previewUrl ? <img src={previewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                      : <ImagePlus className="h-6 w-6 text-ink-soft" aria-hidden="true" />}
        </div>
        <div className="flex flex-wrap gap-3">
          <label htmlFor={id} className="cursor-pointer rounded-xl bg-surface px-4 py-2.5 text-sm font-bold shadow-neu-sm transition-all duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-lime-600 hover:shadow-neu active:shadow-neu-pressed">
            {file ? "Change photo" : "Choose photo"}
            <input id={id} type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePick} className="sr-only" />
          </label>
          {file && (
            <button type="button" onClick={() => onChange(null)} className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-all duration-200 hover:text-ink">
              <X className="h-4 w-4" aria-hidden="true" /> Remove
            </button>
          )}
        </div>
      </div>
      {error ? <p className="mt-2 text-xs font-medium text-danger" role="alert">{error}</p>
             : <p className="mt-2 text-xs text-ink-soft">JPG, PNG or WebP, up to 2 MB.</p>}
    </div>
  );
}
