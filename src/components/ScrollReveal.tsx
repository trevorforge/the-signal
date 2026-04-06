"use client";

import { useRef, useEffect } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function ScrollReveal({ children, className = "", delay = 0, y = 24 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial state
    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;
    el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerReveal({ children, className = "", staggerDelay = 0.08 }: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(20px)";
      child.style.transition = `opacity 0.5s ease ${i * staggerDelay}s, transform 0.5s ease ${i * staggerDelay}s`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.style.opacity = "1";
            child.style.transform = "translateY(0)";
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
