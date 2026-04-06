import type { Metadata, Viewport } from "next";
import { Navigation } from "@/components/Navigation";
import { TopicPills } from "@/components/TopicPills";
import "./globals.css";

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
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('signal-theme')||'dark';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-bg">
        <Navigation />
        <TopicPills />
        <div className="flex-1">{children}</div>
        {/* Footer */}
        <footer className="border-t border-border bg-surface mt-8">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-signal-orange rounded-sm" />
              <span className="font-[Georgia,serif] text-sm font-bold text-text-primary">THE SIGNAL</span>
            </div>
            <p className="text-[12px] text-text-muted">
              Curated daily by Claude for Trevor Morse. Powered by Claude Code.
            </p>
            <p className="text-[11px] text-text-muted mt-1">The Forge Media Group</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
