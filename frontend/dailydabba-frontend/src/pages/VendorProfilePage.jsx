import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheck, Clock3, MapPin, Pencil, Star, Store } from "lucide-react";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Logo from "../components/layout/Logo";
import { vendorProfileService } from "../services/vendorProfileService";

const statusStyles = {
  APPROVED: "bg-lime-100 text-ink",
  VERIFIED: "bg-lime-100 text-ink",
  PENDING: "bg-amber-100 text-amber-900",
  REJECTED: "bg-danger/10 text-danger",
};

function addressLines(address = {}) {
  const cityLine = [address.city, address.state, address.pincode].filter(Boolean).join(", ");
  return [address.line1, address.line2, cityLine, address.landmark && `Near ${address.landmark}`].filter(Boolean);
}

function hasCoordinates(address = {}) {
  return address.latitude != null && address.latitude !== "" && Number.isFinite(Number(address.latitude))
    && address.longitude != null && address.longitude !== "" && Number.isFinite(Number(address.longitude));
}

export default function VendorProfilePage() {
  const location = useLocation();
  const [profile, setProfile] = useState(undefined);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setProfile(undefined);
    setError("");

    vendorProfileService.getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data?.id ? data : null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) setProfile(null);
        else if (err.status === 403) setError("Access to vendor profiles was denied. Check that this request includes a valid Bearer token and that your account has vendor access.");
        else setError(err.status === 401 ? "Your session has expired. Sign in again to view this profile." : err.message);
      });

    return () => { cancelled = true; };
  }, [retryCount]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-5">
          <Logo />
          <div>
            <p className="text-xs font-bold uppercase text-lime-600">Vendor workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold">Business profile</h1>
          </div>
        </div>
        {profile && (
          <Link to="/vendor/profile/edit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-ink shadow-neu-sm transition-colors hover:bg-lime-500">
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit profile
          </Link>
        )}
      </header>

      {profile === undefined && !error && (
        <Card className="flex items-center gap-3 text-sm text-ink-soft" role="status">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-lime-600 border-t-transparent" />
          Loading your business profile...
        </Card>
      )}

      {error && (
        <Card className="space-y-4">
          <Alert>{error}</Alert>
          <Button variant="secondary" onClick={() => setRetryCount((count) => count + 1)}>Try again</Button>
        </Card>
      )}

      {profile === null && !error && (
        <Card className="space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-lime-600">
            <Store className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Your vendor profile is not set up yet</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">Create a business profile to add your kitchen details, address, FSSAI license, and order cutoff time.</p>
          </div>
          <Link to="/vendor/profile/edit" className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-ink shadow-neu-sm transition-colors hover:bg-lime-500">
            Create vendor profile
          </Link>
        </Card>
      )}

      {profile && (
        <>
          {location.state?.saved && <Alert variant="success">Your vendor profile has been saved.</Alert>}
          <Card className="space-y-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface shadow-neu-inset">
                {profile.businessLogoUrl
                  ? <img src={profile.businessLogoUrl} alt={`${profile.businessName} logo`} className="h-full w-full object-cover" />
                  : <Store className="h-8 w-8 text-ink-soft" aria-hidden="true" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold">{profile.businessName}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[profile.verificationStatus] || "bg-surface text-ink-soft"}`}>
                    {profile.verificationStatus || "UNVERIFIED"}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">{profile.description || "No business description provided."}</p>
              </div>
            </div>
            <div className="grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-neu-sm">
                <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <div><p className="text-xs text-ink-soft">Average rating</p><p className="font-bold">{Number(profile.averageRating || 0).toFixed(1)} <span className="font-medium text-ink-soft">({profile.totalReviews || 0} reviews)</span></p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-neu-sm">
                <Clock3 className="h-5 w-5 text-lime-600" aria-hidden="true" />
                <div><p className="text-xs text-ink-soft">Order cutoff</p><p className="font-bold">{profile.orderCutoffTime?.slice(0, 5) || "Not set"}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-neu-sm">
                <BadgeCheck className="h-5 w-5 text-lime-600" aria-hidden="true" />
                <div><p className="text-xs text-ink-soft">Order status</p><p className="font-bold">{profile.acceptingOrders ? "Accepting orders" : "Not accepting orders"}</p></div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="space-y-4">
              <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-lime-600" aria-hidden="true" /><h2 className="text-lg font-bold">Business address</h2></div>
              <address className="space-y-1 text-sm not-italic leading-6 text-ink-soft">
                {addressLines(profile.businessAddress || {}).map((line) => <p key={line}>{line}</p>)}
                {hasCoordinates(profile.businessAddress || {}) && (
                  <p className="pt-2 text-xs">Coordinates: {profile.businessAddress.latitude}, {profile.businessAddress.longitude}</p>
                )}
              </address>
            </Card>
            <Card className="space-y-4">
              <h2 className="text-lg font-bold">Business details</h2>
              <dl className="divide-y divide-ink/10 text-sm">
                <div className="flex justify-between gap-4 py-3"><dt className="text-ink-soft">FSSAI license</dt><dd className="text-right font-semibold">{profile.fssaiLicenseNumber || "Not provided"}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-ink-soft">Profile ID</dt><dd className="break-all text-right font-mono text-xs">{profile.id}</dd></div>
              </dl>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}
