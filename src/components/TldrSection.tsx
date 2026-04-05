interface TldrProps {
  items: string[];
}

export function TldrSection({ items }: TldrProps) {
  return (
    <section className="bg-surface border border-border p-6 sm:p-8">
      <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800">
        TL;DR
      </span>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
            <span className="text-signal-orange mt-0.5 shrink-0">&#x25CF;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
