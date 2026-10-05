import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ImageUpload from "../components/ui/ImageUpload";
import Input from "../components/ui/Input";
import { useForm } from "../hooks/useForm";
import { customerProfileService } from "../services/customerProfileService";
import { validateCustomerProfile } from "../utils/validators";

const DIET_OPTIONS = [
  { value: "VEG", label: "Vegetarian", desc: "No meat, poultry, or fish" },
  { value: "NON_VEG", label: "Non-Vegetarian", desc: "Includes all food varieties & meats" },
  { value: "EGGETARIAN", label: "Eggetarian", desc: "Vegetarian meals plus eggs" },
  { value: "VEGAN", label: "Vegan", desc: "100% plant-based, no dairy or animal products" },
  { value: "JAIN", label: "Jain", desc: "No root vegetables, onions, or garlic" },
];

const initialValues = {
  dietPreference: "VEG",
  "defaultAddress.line1": "",
  "defaultAddress.line2": "",
  "defaultAddress.city": "",
  "defaultAddress.state": "",
  "defaultAddress.pincode": "",
  "defaultAddress.landmark": "",
  "defaultAddress.latitude": "",
  "defaultAddress.longitude": "",
  image: null,
};

function formValuesFromProfile(profile) {
  const address = profile.defaultAddress || {};
  return {
    dietPreference: profile.dietPreference || "VEG",
    "defaultAddress.line1": address.line1 || "",
    "defaultAddress.line2": address.line2 || "",
    "defaultAddress.city": address.city || "",
    "defaultAddress.state": address.state || "",
    "defaultAddress.pincode": address.pincode || "",
    "defaultAddress.landmark": address.landmark || "",
    "defaultAddress.latitude": address.latitude == null ? "" : String(address.latitude),
    "defaultAddress.longitude": address.longitude == null ? "" : String(address.longitude),
    image: null,
  };
}

export default function EditCustomerProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(undefined);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm({ initialValues, validate: validateCustomerProfile });
  const { values, errors, handleChange, handleBlur } = form;
  const field = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });

  useEffect(() => {
    let cancelled = false;
    setLoadingProfile(true);
    setLoadError("");

    customerProfileService
      .getProfile()
      .then((data) => {
        if (cancelled) return;
        const currentProfile = data?.id ? data : null;
        setProfile(currentProfile);
        if (currentProfile) {
          Object.entries(formValuesFromProfile(currentProfile)).forEach(([name, value]) =>
            form.setValue(name, value)
          );
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404 || err.status === 500) {
          setProfile(null);
        } else if (err.status === 403) {
          setLoadError(
            "Access to customer profiles was denied. Check that your account has customer access."
          );
        } else {
          setLoadError(
            err.status === 401
              ? "Your session has expired. Sign in again to edit your profile."
              : err.message
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const onSubmit = async (submittedValues) => {
    setFormError("");
    setSaving(true);
    const addressValue = (name) => submittedValues[`defaultAddress.${name}`];

    try {
      await customerProfileService.saveProfile({
        dietPreference: submittedValues.dietPreference,
        defaultAddress: {
          line1: addressValue("line1").trim(),
          line2: addressValue("line2").trim() || null,
          city: addressValue("city").trim(),
          state: addressValue("state").trim(),
          pincode: addressValue("pincode").trim(),
          landmark: addressValue("landmark").trim() || null,
          latitude: addressValue("latitude") === "" ? null : Number(addressValue("latitude")),
          longitude: addressValue("longitude") === "" ? null : Number(addressValue("longitude")),
        },
        image: submittedValues.image,
      });

      navigate("/customer/profile", { replace: true, state: { saved: true } });
    } catch (err) {
      form.setServerErrors(err.fieldErrors || {});
      setFormError(err.message || "Failed to save profile. Please review the form and try again.");
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 px-4 py-8 sm:px-8">
      <Link
        to="/customer/profile"
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to profile
      </Link>

      <header className="border-b border-ink/10 pb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-lime-600">Customer workspace</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
          {profile ? "Edit personal profile" : "Create personal profile"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Set your dietary preferences and default delivery location for meal deliveries.
        </p>
      </header>

      {loadingProfile && (
        <Card className="text-sm text-ink-soft" role="status">
          Loading profile details...
        </Card>
      )}

      {!loadingProfile && loadError && (
        <Card className="space-y-4">
          <Alert>{loadError}</Alert>
          <Button variant="secondary" onClick={() => setRetryCount((count) => count + 1)}>
            Try again
          </Button>
        </Card>
      )}

      {!loadingProfile && !loadError && (
        <>
          {!profile && (
            <Alert variant="success">
              No customer profile exists yet. Complete these details to set up your profile.
            </Alert>
          )}

          <Card>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
              {formError && <Alert>{formError}</Alert>}

              {/* Section 1: Dietary Preferences */}
              <section className="space-y-5">
                <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                  <UtensilsCrossed className="h-5 w-5 text-lime-600" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-ink">Dietary Preference</h2>
                </div>
                <p className="text-xs text-ink-soft">
                  Select your primary food preference. Local kitchens will prioritize meals that match your choice.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DIET_OPTIONS.map((opt) => {
                    const isSelected = values.dietPreference === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => form.setValue("dietPreference", opt.value)}
                        className={`flex flex-col items-start rounded-2xl p-4 text-left transition-all ${
                          isSelected
                            ? "bg-lime-400/25 ring-2 ring-lime-500 shadow-neu-sm"
                            : "bg-surface shadow-neu-sm hover:shadow-neu"
                        }`}
                      >
                        <span className="font-extrabold text-sm text-ink">{opt.label}</span>
                        <span className="mt-1 text-xs text-ink-soft">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.dietPreference && (
                  <p className="text-xs font-medium text-danger">{errors.dietPreference}</p>
                )}
              </section>

              {/* Section 2: Delivery Address */}
              <section className="space-y-5">
                <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                  <MapPin className="h-5 w-5 text-lime-600" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-ink">Default Delivery Address</h2>
                </div>

                <Input
                  label="Address line 1"
                  autoComplete="address-line1"
                  placeholder="House number, flat, and building name"
                  {...field("defaultAddress.line1")}
                />

                <Input
                  label="Address line 2 (optional)"
                  autoComplete="address-line2"
                  placeholder="Street name, colony, or locality"
                  {...field("defaultAddress.line2")}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="City"
                    autoComplete="address-level2"
                    placeholder="e.g. Pune, Mumbai, Bengaluru"
                    {...field("defaultAddress.city")}
                  />
                  <Input
                    label="State"
                    autoComplete="address-level1"
                    placeholder="e.g. Maharashtra, Karnataka"
                    {...field("defaultAddress.state")}
                  />
                  <Input
                    label="PIN code"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    placeholder="6-digit PIN code"
                    {...field("defaultAddress.pincode")}
                  />
                  <Input
                    label="Landmark (optional)"
                    placeholder="Nearby landmark or recognizable spot"
                    {...field("defaultAddress.landmark")}
                  />
                  <Input
                    label="Latitude (optional)"
                    type="number"
                    step="any"
                    placeholder="e.g. 18.5204"
                    {...field("defaultAddress.latitude")}
                  />
                  <Input
                    label="Longitude (optional)"
                    type="number"
                    step="any"
                    placeholder="e.g. 73.8567"
                    {...field("defaultAddress.longitude")}
                  />
                </div>
              </section>

              {/* Section 3: Optional Profile Photo */}
              <section className="space-y-5">
                <ImageUpload
                  label="Profile photo (optional)"
                  file={values.image}
                  error={errors.image}
                  onChange={(file) => form.setValue("image", file)}
                  onTouched={() => form.touch("image")}
                />
              </section>

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/customer/profile"
                  className="inline-flex items-center justify-center rounded-xl bg-surface px-6 py-3 text-sm font-bold text-ink shadow-neu-sm transition-all hover:shadow-neu active:shadow-neu-pressed"
                >
                  Cancel
                </Link>
                <Button type="submit" loading={saving}>
                  {saving ? "Saving profile" : "Save profile"}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </main>
  );
}
