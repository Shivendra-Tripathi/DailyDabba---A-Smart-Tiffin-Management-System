import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import ImageUpload from "../../components/ui/ImageUpload";
import RoleSelector from "./RoleSelector";
import { useForm } from "../../hooks/useForm";
import { authService } from "../../services/authService";
import { validateRegister } from "../../utils/validators";

const initialValues = { fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "", role: "CUSTOMER", image: null };

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm({ initialValues, validate: validateRegister });
  const { values, errors, handleChange, handleBlur } = form;
  // Shortcut that wires value/onChange/onBlur/error for a field.
  const field = (name) => ({ name, value: values[name], onChange: handleChange, onBlur: handleBlur, error: errors[name] });

  const onSubmit = async (v) => {
    setFormError("");
    setLoading(true);
    const email = v.email.trim().toLowerCase();
    try {
      // confirmPassword is only for the UI, so it is NOT sent to the backend.
      await authService.register({ fullName: v.fullName.trim(), phoneNumber: v.phoneNumber, email, password: v.password, role: v.role, image: v.image });
      navigate("/login", { replace: true, state: { registered: true, email } });
    } catch (err) {
      form.setServerErrors(err.fieldErrors || {}); // field-level errors from the backend, if any
      setFormError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
      {formError && <Alert>{formError}</Alert>}
      <RoleSelector value={values.role} onChange={handleChange} />
      <Input label="Full name" icon={User} autoComplete="name" placeholder="Rahul Sharma" {...field("fullName")} />
      <Input label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" {...field("email")} />
      {/* Phone: keep digits only, max 10 */}
      <Input label="Phone number" icon={Phone} type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="9876543210"
        {...field("phoneNumber")} onChange={(e) => form.setValue("phoneNumber", e.target.value.replace(/\D/g, ""))} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Password" icon={Lock} type="password" autoComplete="new-password" placeholder="Create a password" {...field("password")} />
        <Input label="Confirm password" icon={Lock} type="password" autoComplete="new-password" placeholder="Repeat password" {...field("confirmPassword")} />
      </div>
      <ImageUpload label="Profile picture (optional)" file={values.image} error={errors.image}
        onChange={(file) => form.setValue("image", file)} onTouched={() => form.touch("image")} />
      <Button type="submit" fullWidth loading={loading}>{loading ? "Creating account" : "Create account"}</Button>
    </form>
  );
}
