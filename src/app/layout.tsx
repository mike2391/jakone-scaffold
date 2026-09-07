import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "JakOne — ODP IT Bank Jakarta 2026",
  description: "Day 4 frontend prototype built against the shared JakOne API contract",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-ink antialiased">
        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Jak<span className="text-brand">One</span>
            </Link>
            <nav className="flex gap-6 text-sm font-bold ">
              <Link href="/" className="hover:text-brand">
                Accounts
              </Link>
              <Link href="/accounts/new" className="hover:text-brand">
                Open account
              </Link>
              <Link href="/product" className="hover:text-brand">
                Product
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <footer className="mx-auto max-w-5xl px-6 pb-10 text-xs font-bold tracking-widest text-foreground">
          ODP IT BANK JAKARTA 2026 &middot; DAY 4 &middot; FRONTEND ENGINEERING
        </footer>
      </body>
    </html>
  );
}
