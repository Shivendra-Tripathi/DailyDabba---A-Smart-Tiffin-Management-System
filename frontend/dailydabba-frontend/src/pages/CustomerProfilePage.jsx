import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Heart, MapPin, Pencil, User, UtensilsCrossed } from "lucide-react";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Logo from "../components/layout/Logo";
import DietBadge from "../components/catalog/DietBadge";
import { customerProfileService } from "../services/customerProfileService";

function addressLines(address = {}) {
  const cityLine = [address.city, address.state, address.pincode].filter(Boolean).join(", ");
  return [address.line1, address.line2, cityLine, address.landmark && `Near ${address.landmark}`].filter(Boolean);
}

function hasCoordinates(address = {}) {
  return (
    address.latitude != null &&
    address.latitude !== "" &&
    Number.isFinite(Number(address.latitude)) &&
    address.longitude != null &&
    address.longitude !== "" &&
    Number.isFinite(Number(address.longitude))
  );
}

const DIET_DESCRIPTIONS = {
  VEG: "Vegetarian meals only — no meat, fish, or poultry.",
  NON_VEG: "Includes vegetarian dishes, chicken, meat, and fish options.",
  EGGETARIAN: "Vegetarian meals and egg-based dishes included.",
  VEGAN: "Plant-based meals only — 100% free of animal and dairy products.",
  JAIN: "Vegetarian meals prepared without root vegetables like onions, potatoes, and garlic.",
};

export default function CustomerProfilePage() {
  const location = useLocation();
  const [profile, setProfile] = useState(undefined);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setProfile(undefined);
    setError("");

    customerProfileService
      .getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data?.id ? data : null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404 || err.status === 500) {
          setProfile(null);
        } else if (err.status === 403) {
          setError(
            "Access to customer profile was denied. Ensure your account is signed in with customer permissions."
          );
        } else {
          setError(
            err.status === 401
              ? "Your session has expired. Sign in again to view your profile."
              : err.message
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 px-4 py-8 sm:px-8">
      {/* Header */}
      <header className="flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <Logo />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-lime-600">Customer workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">Personal profile</h1>
            <p className="mt-1 text-sm text-ink-soft">Manage your dietary preferences and default delivery address.</p>
          </div>
        </div>

        {profile && (
          <Link
            to="/customer/profile/edit"
            state={{ profile }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-ink shadow-neu-sm transition-all hover:bg-lime-500 active:shadow-neu-pressed"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit profile
          </Link>
        )}
      </header>

      {/* Loading state */}
      {profile === undefined && !error && (
        <Card className="flex items-center gap-3 text-sm text-ink-soft" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-lime-600 border-t-transparent" />
          Loading your customer profile...
        </Card>
      )}

      {/* Error state */}
      {error && (
        <Card className="space-y-4">
          <Alert>{error}</Alert>
          <Button variant="secondary" onClick={() => setRetryCount((count) => count + 1)}>
            Try again
          </Button>
        </Card>
      )}

      {/* Profile not set up yet */}
      {profile === null && !error && (
        <Card className="space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-lime-600 shadow-neu-sm">
            <User className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Your customer profile is not set up yet</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
              Set up your dietary preferences and delivery address so local home chefs and tiffin vendors can deliver meals right to your doorstep.
            </p>
          </div>
          <Link
            to="/customer/profile/edit"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-ink shadow-neu-sm transition-all hover:bg-lime-500 active:shadow-neu-pressed"
          >
            Create customer profile
          </Link>
        </Card>
      )}

      {/* Profile initialized */}
      {profile && (
        <>
          {location.state?.saved && <Alert variant="success">Your customer profile has been saved.</Alert>}

          {/* Main Profile Overview Card */}
          <Card className="space-y-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface shadow-neu-inset">
                <User className="h-8 w-8 text-ink-soft" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-ink">Customer Account</h2>
                  <DietBadge dietType={profile.dietPreference} />
                </div>
                <p className="mt-1.5 text-xs text-ink-soft">
                  {DIET_DESCRIPTIONS[profile.dietPreference] || "Custom dietary preferences set."}
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-neu-sm">
                <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-soft">Diet Preference</p>
                  <p className="font-bold text-ink">{profile.dietPreference || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-neu-sm">
                <MapPin className="h-5 w-5 text-lime-600" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-soft">Delivery City</p>
                  <p className="font-bold text-ink">
                    {profile.defaultAddress?.city
                      ? `${profile.defaultAddress.city} (${profile.defaultAddress.pincode})`
                      : "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-neu-sm">
                <CheckCircle2 className="h-5 w-5 text-lime-600" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-soft">Profile Status</p>
                  <p className="font-bold text-ink">Delivery Ready</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Details Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Delivery Address Card */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                <MapPin className="h-5 w-5 text-lime-600" aria-hidden="true" />
                <h2 className="text-lg font-bold text-ink">Default Delivery Address</h2>
              </div>
              <address className="space-y-1 text-sm not-italic leading-6 text-ink-soft">
                {addressLines(profile.defaultAddress || {}).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {hasCoordinates(profile.defaultAddress || {}) && (
                  <p className="pt-2 text-xs text-ink-soft/70">
                    Coordinates: {profile.defaultAddress.latitude}, {profile.defaultAddress.longitude}
                  </p>
                )}
              </address>
            </Card>

            {/* Diet & Account Details Card */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
                <UtensilsCrossed className="h-5 w-5 text-lime-600" aria-hidden="true" />
                <h2 className="text-lg font-bold text-ink">Diet & Subscription Details</h2>
              </div>
              <dl className="divide-y divide-ink/10 text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-soft">Preferred Diet</dt>
                  <dd className="font-semibold text-ink">{profile.dietPreference || "Not chosen"}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-soft">Meal Curation</dt>
                  <dd className="text-right font-medium text-ink-soft text-xs">
                    Tiffins filtered according to your preference
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-soft">Customer ID</dt>
                  <dd className="break-all text-right font-mono text-xs text-ink-soft">{profile.id}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}
