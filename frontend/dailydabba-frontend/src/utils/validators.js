// All form validation rules live here. Each rule returns "" when valid, or an error message.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_IMAGE_MB = 2;

const email = (v) =>
  !v.trim() ? "Enter your email address."
  : !EMAIL_REGEX.test(v.trim()) ? "Enter a valid email, like name@example.com." : "";

// Used at login: only checks it is filled in (the server decides if it is correct).
const requiredPassword = (v) => (!v ? "Enter your password." : "");

// Used at registration: enforces a strong password.
const strongPassword = (v) => {
  if (!v) return "Create a password.";
  const missing = [];
  if (v.length < 8) missing.push("8+ characters");
  if (!/[a-z]/.test(v)) missing.push("a lowercase letter");
  if (!/[A-Z]/.test(v)) missing.push("an uppercase letter");
  if (!/\d/.test(v)) missing.push("a number");
  if (!/[^A-Za-z0-9]/.test(v)) missing.push("a special character");
  return missing.length ? `Password needs ${missing.join(", ")}.` : "";
};

const fullName = (v) =>
  !v.trim() ? "Enter your full name." : v.trim().length < 2 ? "Name must be at least 2 characters." : "";

// Indian 10-digit mobile number. Change this one rule to support other formats.
const phoneNumber = (v) =>
  !v ? "Enter your phone number." : !/^[6-9]\d{9}$/.test(v) ? "Enter a 10-digit mobile number starting with 6-9." : "";

const image = (file) =>
  !file ? ""
  : !file.type.startsWith("image/") ? "Choose an image file (JPG, PNG or WebP)."
  : file.size > MAX_IMAGE_MB * 1024 * 1024 ? `Image must be smaller than ${MAX_IMAGE_MB} MB.` : "";

// Keeps only the fields that have an error message.
const onlyErrors = (obj) => Object.fromEntries(Object.entries(obj).filter(([, msg]) => msg));

const optionalImage = (file) =>
  !file ? ""
  : !file.type.startsWith("image/") ? "Choose an image file (JPG, PNG or WebP)."
  : file.size > MAX_IMAGE_MB * 1024 * 1024 ? `Image must be smaller than ${MAX_IMAGE_MB} MB.` : "";

export const validateVendorProfile = (v) =>
  onlyErrors({
    businessName: !v.businessName.trim() ? "Enter your business name." : "",
    description: !v.description.trim() ? "Enter a description of your business." : "",
    "businessAddress.line1": !v["businessAddress.line1"].trim() ? "Enter the street address." : "",
    "businessAddress.city": !v["businessAddress.city"].trim() ? "Enter the city." : "",
    "businessAddress.state": !v["businessAddress.state"].trim() ? "Enter the state." : "",
    "businessAddress.pincode": !/^\d{6}$/.test(v["businessAddress.pincode"]) ? "Enter a 6-digit PIN code." : "",
    fssaiLicenseNumber: !/^\d{14}$/.test(v.fssaiLicenseNumber) ? "Enter the 14-digit FSSAI license number." : "",
    orderCutoffTime: !v.orderCutoffTime ? "Choose an order cutoff time." : "",
    "businessAddress.latitude": v["businessAddress.latitude"] !== "" && (!Number.isFinite(Number(v["businessAddress.latitude"])) || Number(v["businessAddress.latitude"]) < -90 || Number(v["businessAddress.latitude"]) > 90) ? "Enter a latitude between -90 and 90." : "",
    "businessAddress.longitude": v["businessAddress.longitude"] !== "" && (!Number.isFinite(Number(v["businessAddress.longitude"])) || Number(v["businessAddress.longitude"]) < -180 || Number(v["businessAddress.longitude"]) > 180) ? "Enter a longitude between -180 and 180." : "",
    image: optionalImage(v.image),
  });

export const validateLogin = (v) => onlyErrors({ email: email(v.email), password: requiredPassword(v.password) });

export const validateRegister = (v) =>
  onlyErrors({
    fullName: fullName(v.fullName),
    email: email(v.email),
    phoneNumber: phoneNumber(v.phoneNumber),
    password: strongPassword(v.password),
    confirmPassword: !v.confirmPassword ? "Confirm your password." : v.confirmPassword !== v.password ? "Passwords do not match." : "",
    image: image(v.image),
  });
