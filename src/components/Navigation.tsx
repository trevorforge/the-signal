"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Saved", href: "/saved" },
  { label: "Archive", href: "/archive" },
  { label: "Topics", href: "/topics" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)]">
        <div className="flex items-center h-16 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-1 h-6 bg-signal-orange rounded-sm" />
            <span className="font-display text-lg font-bold text-text-primary tracking-tight">
              THE SIGNAL
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-text-primary font-semibold"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-text-muted hover:text-text-primary transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-surface" aria-label="Mobile navigation">
          <div className="px-[var(--space-content-px-mobile)] py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base transition-colors ${
                  isActive(link.href)
                    ? "text-text-primary font-semibold bg-surface-inset"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-inset"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
