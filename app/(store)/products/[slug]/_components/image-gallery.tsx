"use client";

import { useState } from "react";

type GalleryImage = { id: number; url: string; altText: string | null; isPrimary: boolean };

export default function ImageGallery({
  images,
  productName,
  badge,
}: {
  images: GalleryImage[];
  productName: string;
  badge?: React.ReactNode;
}) {
  const primaryIndex = images.findIndex((i) => i.isPrimary);
  const [active, setActive] = useState(primaryIndex >= 0 ? primaryIndex : 0);

  const current = images[active];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.altText ?? productName}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-200">
            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
            </svg>
          </div>
        )}
        {badge && <div className="absolute top-4 left-4">{badge}</div>}
      </div>

      {/* Thumbnails — only shown when there are multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? "border-amber-500 shadow-md"
                  : "border-stone-200 hover:border-amber-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.altText ?? ""}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
