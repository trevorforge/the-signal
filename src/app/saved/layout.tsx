import type { Metadata } from "next";

export const metadata: Metadata = { title: "Saved — The Signal", description: "Your bookmarked stories" };

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
