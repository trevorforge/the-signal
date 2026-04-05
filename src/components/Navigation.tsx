"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const tabs = [
  { label: "Today", href: "/" },
  { label: "Archive", href: "/archive" },
  { label: "Topics", href: "/topics" },
  { label: "Saved", href: "/saved" },
];

export function Navigation() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-0 z-50 bg-chrome border-b border-border/30 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Branding */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-6 bg-signal-orange rounded-sm" />
            <span className="font-[Georgia,serif] text-sm font-bold text-white tracking-tight">
              THE SIGNAL
            </span>
          </Link>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive(tab.href)
                    ? "text-signal-orange bg-signal-orange/10"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
