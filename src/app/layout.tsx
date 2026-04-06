import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Signal",
  description: "Daily AI intelligence for creative builders",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "The Signal",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('signal-theme')||'light';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-bg">
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Navigation />
        <div id="main-content" className="flex-1">{children}</div>
        {/* Footer */}
        <footer className="border-t border-border mt-[var(--space-section)]">
          <div className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] py-14">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 md:gap-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-6 bg-signal-orange rounded-sm" />
                  <span className="font-display text-lg font-bold text-text-primary tracking-tight">
                    THE SIGNAL
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                  AI intelligence for creative builders. Curated by Claude, built by Trevor Morse at The Forge.
                </p>
              </div>
              {/* Nav */}
              <nav className="flex flex-col gap-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Navigate</span>
                <a href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">Home</a>
                <a href="/topics" className="text-sm text-text-muted hover:text-text-primary transition-colors">Topics</a>
                <a href="/archive" className="text-sm text-text-muted hover:text-text-primary transition-colors">Archive</a>
                <a href="/saved" className="text-sm text-text-muted hover:text-text-primary transition-colors">Saved</a>
              </nav>
              {/* Meta */}
              <nav className="flex flex-col gap-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Powered By</span>
                <span className="text-sm text-text-muted">Claude Code</span>
                <span className="text-sm text-text-muted">Next.js 16</span>
                <span className="text-sm text-text-muted">Vercel</span>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
