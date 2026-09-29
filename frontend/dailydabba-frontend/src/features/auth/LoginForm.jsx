import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../context/AuthContext";
import { validateLogin } from "../../utils/validators";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // If we arrived from Register, prefill the email and show a success message.
  const justRegistered = location.state?.registered;
  const form = useForm({ initialValues: { email: location.state?.email || "", password: "" }, validate: validateLogin });

  const onSubmit = async ({ email, password }) => {
    setFormError("");
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      navigate(location.state?.from || "/home", { replace: true });
    } catch (err) {
      setFormError(err.message); // e.g. wrong password, or server unreachable
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
      {justRegistered && !formError && <Alert variant="success">Account created. Sign in to continue.</Alert>}
      {formError && <Alert>{formError}</Alert>}
      <Input label="Email" icon={Mail} type="email" name="email" autoComplete="email" placeholder="you@example.com"
        value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
      <Input label="Password" icon={Lock} type="password" name="password" autoComplete="current-password" placeholder="Your password"
        value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.password} />
      <Button type="submit" fullWidth loading={loading}>{loading ? "Signing in" : "Sign in"}</Button>
    </form>
  );
}
