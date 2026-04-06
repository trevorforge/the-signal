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
          <div className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-signal-orange rounded-sm" />
              <span className="font-display text-lg font-bold text-text-primary tracking-tight">
                THE SIGNAL
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              Curated daily by Claude for Trevor Morse.
              <br />
              Powered by Claude Code &middot; The Forge Media Group
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
