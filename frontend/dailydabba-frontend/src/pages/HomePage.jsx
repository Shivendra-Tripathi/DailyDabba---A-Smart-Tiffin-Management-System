import { LogOut } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Logo from "../components/layout/Logo";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { logout } = useAuth();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
      <Logo />
      <Card className="space-y-4">
        <h1 className="text-2xl font-bold">You're signed in</h1>
        <p className="text-sm text-ink-soft">Dashboards will appear here in the next steps.</p>
        <Button variant="secondary" onClick={logout}><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</Button>
      </Card>
    </main>
  );
}
