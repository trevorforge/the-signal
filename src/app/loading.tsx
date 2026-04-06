export default function Loading() {
  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-6 pb-16">
      <div className="animate-pulse">
        <div className="h-4 w-40 bg-surface-inset rounded mb-6" />
        <div className="rounded-xl bg-surface-inset h-[400px] md:h-[520px] lg:h-[600px] mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[0,1,2].map(i => (
            <div key={i}>
              <div className="rounded-lg bg-surface-inset h-[240px] mb-4" />
              <div className="h-4 bg-surface-inset rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface-inset rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
