"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "For You", href: "/saved" },
  { label: "Archive", href: "/archive" },
  { label: "Topics", href: "/topics" },
];

export function Navigation() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-11 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-5 bg-signal-orange rounded-sm" />
            <span className="font-[Georgia,serif] text-base font-bold text-text-primary tracking-tight">
              THE SIGNAL
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1 text-[13px] font-medium rounded transition-colors ${
                  isActive(link.href)
                    ? "text-text-primary font-semibold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
