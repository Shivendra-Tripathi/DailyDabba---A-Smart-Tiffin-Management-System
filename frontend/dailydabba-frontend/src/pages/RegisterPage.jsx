import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import RegisterForm from "../features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      wide
      title="Create your account"
      subtitle="Join as a customer or a vendor. It takes a minute."
      footer={<>Already have an account? <Link to="/login" className="font-bold text-ink underline decoration-lime-500 underline-offset-4">Sign in</Link></>}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
