import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your tiffins."
      footer={<>New to DailyDabba? <Link to="/register" className="font-bold text-ink underline decoration-lime-500 underline-offset-4">Create an account</Link></>}
    >
      <LoginForm />
    </AuthLayout>
  );
}
