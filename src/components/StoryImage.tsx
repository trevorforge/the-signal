"use client";

import { useState, useRef, useEffect } from "react";

interface StoryImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackLabel: string;
  className?: string;
  fallbackClassName?: string;
}

export function StoryImage({ src, alt, fallbackLabel, className = "", fallbackClassName = "" }: StoryImageProps) {
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-surface-inset via-surface to-surface-inset ${fallbackClassName || className}`}>
        <span className="text-2xl md:text-3xl text-text-muted/25 font-display font-bold tracking-tight text-center px-6 leading-tight">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src!}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

interface HeroImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackLabel: string;
  className?: string;
}

export function HeroImage({ src, alt, fallbackLabel, className = "" }: HeroImageProps) {
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] ${className}`}>
        <span className="text-5xl md:text-7xl text-white/8 font-display font-bold tracking-tight text-center px-8 leading-tight">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src!}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
