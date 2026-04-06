import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] py-24">
      <div className="text-center max-w-md">
        <span className="text-7xl font-display font-bold text-signal-orange">404</span>
        <h1 className="font-display text-3xl font-bold text-text-primary mt-4 mb-3">
          Story not found
        </h1>
        <p className="text-base text-text-muted mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-signal-orange text-white text-sm font-semibold rounded-lg hover:bg-signal-orange/90 transition-colors"
        >
          Back to The Signal
        </Link>
      </div>
    </main>
  );
}
