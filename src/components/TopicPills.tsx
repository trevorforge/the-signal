"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

const topics: { slug: StoryCategory; label: string }[] = [
  { slug: "claude-anthropic", label: "Claude / Anthropic" },
  { slug: "competitive-intel", label: "OpenAI & Google" },
  { slug: "ai-coding", label: "AI Coding" },
  { slug: "ai-agents", label: "AI Agents" },
  { slug: "design-tools", label: "Design Tools" },
  { slug: "creative-advertising", label: "Creative & Ads" },
  { slug: "rag-knowledge", label: "RAG & Knowledge" },
  { slug: "product-launches", label: "Product Launches" },
];

export function TopicPills() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-hide">
          {topics.map((t) => {
            const active = pathname === `/topics/${t.slug}`;
            const config = CATEGORY_CONFIG[t.slug];
            return (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${
                  active
                    ? "border-text-primary bg-text-primary text-surface"
                    : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
