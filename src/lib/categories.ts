import { StoryCategory } from "./types";

interface CategoryConfig {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
}

export const CATEGORY_CONFIG: Record<StoryCategory, CategoryConfig> = {
  "claude-anthropic": {
    label: "Claude / Anthropic",
    color: "#2BA5B5",
    bgClass: "bg-cat-claude/15",
    textClass: "text-cat-claude",
  },
  "design-tools": {
    label: "Design Tools",
    color: "#8b5cf6",
    bgClass: "bg-cat-design/15",
    textClass: "text-cat-design",
  },
  "creative-advertising": {
    label: "Creative / Advertising",
    color: "#3b82f6",
    bgClass: "bg-cat-creative/15",
    textClass: "text-cat-creative",
  },
  "rag-knowledge": {
    label: "RAG / Knowledge",
    color: "#a855f7",
    bgClass: "bg-cat-knowledge/15",
    textClass: "text-cat-knowledge",
  },
  "competitive-intel": {
    label: "Competitive Intel",
    color: "#ef4444",
    bgClass: "bg-cat-competitive/15",
    textClass: "text-cat-competitive",
  },
  "ai-coding": {
    label: "AI Coding",
    color: "#10b981",
    bgClass: "bg-cat-coding/15",
    textClass: "text-cat-coding",
  },
  "ai-agents": {
    label: "AI Agents",
    color: "#f59e0b",
    bgClass: "bg-cat-agents/15",
    textClass: "text-cat-agents",
  },
  "product-launches": {
    label: "Product Launches",
    color: "#ec4899",
    bgClass: "bg-cat-product/15",
    textClass: "text-cat-product",
  },
  general: {
    label: "General",
    color: "#6b7280",
    bgClass: "bg-cat-general/15",
    textClass: "text-cat-general",
  },
};

export function getCategoryConfig(category?: StoryCategory): CategoryConfig {
  return CATEGORY_CONFIG[category ?? "general"];
}
