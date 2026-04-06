"use client";

import { useState } from "react";

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function ServiceIcon({ name, url }: { name: string; url: string | null }) {
  const [imgError, setImgError] = useState(false);
  const domain = url ? getDomain(url) : null;

  if (domain && !imgError) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
        alt=""
        width={24}
        height={24}
        className="rounded flex-shrink-0"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${colorForName(name)}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
