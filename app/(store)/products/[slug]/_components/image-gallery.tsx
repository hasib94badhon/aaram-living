"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryItem = {
  id: number;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  mediaType?: string | null;
  sortOrder?: number | null;
};

export default function ImageGallery({
  images,
  productName,
  badge,
}: {
  images: GalleryItem[];
  productName: string;
  badge?: React.ReactNode;
}) {
  const sorted = [...images].sort((a, b) => {
    const sa = a.sortOrder ?? 0;
    const sb = b.sortOrder ?? 0;
    return sa - sb;
  });
  const primaryIndex = sorted.findIndex((i) => i.isPrimary);
  const [active, setActive] = useState(primaryIndex >= 0 ? primaryIndex : 0);

  const current = sorted[active];
  const isVideo = current?.mediaType === "video";

  return (
    <div className="space-y-3">
      {/* Main display — image or video */}
      <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200">
        {current ? (
          isVideo ? (
            <video
              key={current.url}
              src={current.url}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              key={current.url}
              src={current.url}
              alt={current.altText ?? productName}
              fill
              unoptimized
              priority
              className="object-cover transition-opacity duration-200"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-200">
            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
            </svg>
          </div>
        )}
        {badge && !isVideo && (
          <div className="absolute top-4 left-4">{badge}</div>
        )}
      </div>

      {/* Thumbnails — shown when there are 2+ media items */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all relative ${
                i === active
                  ? "border-amber-500 shadow-md"
                  : "border-stone-200 hover:border-amber-300"
              }`}
            >
              {item.mediaType === "video" ? (
                <>
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </>
              ) : (
                <Image
                  src={item.url}
                  alt={item.altText ?? ""}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
