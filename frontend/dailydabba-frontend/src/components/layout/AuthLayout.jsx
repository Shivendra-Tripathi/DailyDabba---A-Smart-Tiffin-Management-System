import { CalendarCheck, Users, Soup } from "lucide-react";
import Logo from "./Logo";
import Card from "../ui/Card";

const highlights = [
  { icon: Soup, text: "Browse tiffin plans from local kitchens" },
  { icon: CalendarCheck, text: "Manage subscriptions and daily meals" },
  { icon: Users, text: "Vendors keep customers and orders in one place" },
];

// Shared shell for Login + Register: brand panel on the left (desktop only), form card on the right.
export default function AuthLayout({ title, subtitle, children, footer, wide = false }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center gap-12 px-4 py-10 sm:px-8">
      <section className="hidden flex-1 space-y-8 lg:block">
        <Logo />
        <h1 className="max-w-md text-4xl font-extrabold leading-tight">Home-cooked meals, managed without the notebook.</h1>
        <ul className="space-y-4">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-4 text-sm font-medium">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface shadow-neu-sm">
                <Icon className="h-4 w-4 text-lime-600" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className={`mx-auto w-full ${wide ? "max-w-xl" : "max-w-md"} space-y-6`}>
        <div className="lg:hidden"><Logo /></div>
        <Card>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </Card>
        <p className="text-center text-sm text-ink-soft">{footer}</p>
      </section>
    </main>
  );
}
