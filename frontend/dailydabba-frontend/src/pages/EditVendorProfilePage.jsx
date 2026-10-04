import { useEffect, useId, useState } from "react";
import { ArrowLeft, MapPin, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ImageUpload from "../components/ui/ImageUpload";
import Input from "../components/ui/Input";
import { useForm } from "../hooks/useForm";
import { vendorProfileService } from "../services/vendorProfileService";
import { validateVendorProfile } from "../utils/validators";

const initialValues = {
  businessName: "",
  description: "",
  "businessAddress.line1": "",
  "businessAddress.line2": "",
  "businessAddress.city": "",
  "businessAddress.state": "",
  "businessAddress.pincode": "",
  "businessAddress.landmark": "",
  "businessAddress.latitude": "",
  "businessAddress.longitude": "",
  fssaiLicenseNumber: "",
  orderCutoffTime: "",
  image: null,
};

function formValuesFromProfile(profile) {
  const address = profile.businessAddress || {};
  return {
    businessName: profile.businessName || "",
    description: profile.description || "",
    "businessAddress.line1": address.line1 || "",
    "businessAddress.line2": address.line2 || "",
    "businessAddress.city": address.city || "",
    "businessAddress.state": address.state || "",
    "businessAddress.pincode": address.pincode || "",
    "businessAddress.landmark": address.landmark || "",
    "businessAddress.latitude": address.latitude == null ? "" : String(address.latitude),
    "businessAddress.longitude": address.longitude == null ? "" : String(address.longitude),
    fssaiLicenseNumber: profile.fssaiLicenseNumber || "",
    orderCutoffTime: profile.orderCutoffTime?.slice(0, 5) || "",
    image: null,
  };
}

function TextareaField({ label, error, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full resize-y rounded-xl bg-surface px-4 py-3 text-sm shadow-neu-inset outline-none transition-all focus:shadow-neu-inset-focus focus:ring-2 focus:ring-lime-400/70 ${error ? "ring-2 ring-danger/50" : ""}`}
        rows={4}
        {...props}
      />
      {error && <p id={errorId} className="mt-2 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export default function EditVendorProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(undefined);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useForm({ initialValues, validate: validateVendorProfile });
  const { values, errors, handleChange, handleBlur } = form;
  const field = (name) => ({ name, value: values[name], onChange: handleChange, onBlur: handleBlur, error: errors[name] });

  useEffect(() => {
    let cancelled = false;
    setLoadingProfile(true);
    setLoadError("");

    vendorProfileService.getProfile()
      .then((data) => {
        if (cancelled) return;
        const currentProfile = data?.id ? data : null;
        setProfile(currentProfile);
        if (currentProfile) {
          Object.entries(formValuesFromProfile(currentProfile)).forEach(([name, value]) => form.setValue(name, value));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) setProfile(null);
        else if (err.status === 403) setLoadError("Access to vendor profiles was denied. Check that this request includes a valid Bearer token and that your account has vendor access.");
        else setLoadError(err.status === 401 ? "Your session has expired. Sign in again to edit this profile." : err.message);
      })
      .finally(() => { if (!cancelled) setLoadingProfile(false); });

    return () => { cancelled = true; };
  }, [retryCount]);

  const onSubmit = async (submittedValues) => {
    setFormError("");
    setSaving(true);
    const addressValue = (name) => submittedValues[`businessAddress.${name}`];
    try {
      await vendorProfileService.saveProfile({
        businessName: submittedValues.businessName.trim(),
        description: submittedValues.description.trim(),
        businessAddress: {
          line1: addressValue("line1").trim(),
          line2: addressValue("line2").trim() || null,
          city: addressValue("city").trim(),
          state: addressValue("state").trim(),
          pincode: addressValue("pincode").trim(),
          landmark: addressValue("landmark").trim() || null,
          latitude: addressValue("latitude") === "" ? null : Number(addressValue("latitude")),
          longitude: addressValue("longitude") === "" ? null : Number(addressValue("longitude")),
        },
        fssaiLicenseNumber: submittedValues.fssaiLicenseNumber.trim(),
        orderCutoffTime: submittedValues.orderCutoffTime.length === 5 ? `${submittedValues.orderCutoffTime}:00` : submittedValues.orderCutoffTime,
        image: submittedValues.image,
      });
      navigate("/vendor/profile", { replace: true, state: { saved: true } });
    } catch (err) {
      form.setServerErrors(err.fieldErrors || {});
      setFormError(err.message);
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 px-4 py-8 sm:px-8">
      <Link to="/vendor/profile" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to profile
      </Link>
      <header className="border-b border-ink/10 pb-5">
        <p className="text-xs font-bold uppercase text-lime-600">Vendor workspace</p>
        <h1 className="mt-1 text-3xl font-extrabold">{profile ? "Edit business profile" : "Create business profile"}</h1>
        <p className="mt-2 text-sm text-ink-soft">Keep your kitchen and delivery details up to date.</p>
      </header>

      {loadingProfile && <Card className="text-sm text-ink-soft" role="status">Loading profile details...</Card>}
      {!loadingProfile && loadError && (
        <Card className="space-y-4">
          <Alert>{loadError}</Alert>
          <Button variant="secondary" onClick={() => setRetryCount((count) => count + 1)}>Try again</Button>
        </Card>
      )}

      {!loadingProfile && !loadError && (
        <>
          {!profile && <Alert variant="success">No vendor profile exists yet. Complete these details to create one.</Alert>}
          <Card>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
              {formError && <Alert>{formError}</Alert>}

              <section className="space-y-5">
                <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                  <Store className="h-5 w-5 text-lime-600" aria-hidden="true" />
                  <h2 className="text-lg font-bold">Business information</h2>
                </div>
                <Input label="Business name" autoComplete="organization" placeholder="Shiv Ghar Ka Tiffin" {...field("businessName")} />
                <TextareaField label="Description" placeholder="Describe your kitchen and the meals you prepare." {...field("description")} />
                <Input label="FSSAI license number" inputMode="numeric" maxLength={14} placeholder="14-digit license number" {...field("fssaiLicenseNumber")} />
                <Input label="Order cutoff time" type="time" {...field("orderCutoffTime")} />
                <ImageUpload label="Business logo (optional)" file={values.image} currentImageUrl={profile?.businessLogoUrl}
                  error={errors.image} onChange={(file) => form.setValue("image", file)} onTouched={() => form.touch("image")} />
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                  <MapPin className="h-5 w-5 text-lime-600" aria-hidden="true" />
                  <h2 className="text-lg font-bold">Business address</h2>
                </div>
                <Input label="Address line 1" autoComplete="address-line1" placeholder="House number and street" {...field("businessAddress.line1")} />
                <Input label="Address line 2 (optional)" autoComplete="address-line2" placeholder="Area, apartment, or locality" {...field("businessAddress.line2")} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="City" autoComplete="address-level2" {...field("businessAddress.city")} />
                  <Input label="State" autoComplete="address-level1" {...field("businessAddress.state")} />
                  <Input label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" {...field("businessAddress.pincode")} />
                  <Input label="Landmark (optional)" placeholder="Nearby landmark" {...field("businessAddress.landmark")} />
                  <Input label="Latitude (optional)" type="number" step="any" {...field("businessAddress.latitude")} />
                  <Input label="Longitude (optional)" type="number" step="any" {...field("businessAddress.longitude")} />
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:justify-end">
                <Link to="/vendor/profile" className="inline-flex items-center justify-center rounded-xl bg-surface px-6 py-3 text-sm font-bold text-ink shadow-neu-sm transition-all hover:shadow-neu">Cancel</Link>
                <Button type="submit" loading={saving}>{saving ? "Saving profile" : "Save profile"}</Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </main>
  );
}
