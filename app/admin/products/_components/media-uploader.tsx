"use client";

import { useState, useCallback, useRef } from "react";

export type MediaItem = {
  clientId: string;
  dbId?: number;
  localUrl: string;
  remoteUrl: string;
  mediaType: "image" | "video";
  isPrimary: boolean;
  sortOrder: number;
  uploading: boolean;
  error: string | null;
};

type InitialMedia = {
  id: number;
  url: string;
  mediaType: string;
  isPrimary: boolean;
  sortOrder: number;
};

type Props = {
  folder: string;
  initial?: InitialMedia[];
  onChange: (items: MediaItem[]) => void;
};

export default function MediaUploader({ folder, initial = [], onChange }: Props) {
  const [items, setItems] = useState<MediaItem[]>(() =>
    [...initial]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m, i) => ({
        clientId: `db-${m.id}`,
        dbId: m.id,
        localUrl: m.url,
        remoteUrl: m.url,
        mediaType: (m.mediaType === "video" ? "video" : "image") as "image" | "video",
        isPrimary: m.isPrimary,
        sortOrder: i,
        uploading: false,
        error: null,
      }))
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Sync state and notify parent
  const sync = useCallback(
    (next: MediaItem[]) => {
      setItems(next);
      onChange(next);
    },
    [onChange]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const maxMB = isImage ? 4 : 3;

      if (!isImage && !isVideo) {
        alert(`"${file.name}" is not a supported file type.`);
        return;
      }
      if (file.size > maxMB * 1024 * 1024) {
        alert(`"${file.name}" is too large. Max ${maxMB} MB for ${isImage ? "images" : "videos"}.`);
        return;
      }

      const clientId = `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const localUrl = URL.createObjectURL(file);

      // Add placeholder with local preview immediately
      setItems((prev) => {
        const isFirstImage = isImage && !prev.some((m) => m.mediaType === "image");
        const next: MediaItem[] = [
          ...prev,
          {
            clientId,
            localUrl,
            remoteUrl: "",
            mediaType: isImage ? "image" : "video",
            isPrimary: isFirstImage,
            sortOrder: prev.length,
            uploading: true,
            error: null,
          },
        ];
        onChange(next);
        return next;
      });

      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });

        // Parse JSON safely — if the server returns HTML (e.g. timeout page), capture it
        let data: { url?: string; mediaType?: string; error?: string };
        try {
          data = await res.json();
        } catch {
          const text = await res.text().catch(() => "");
          const snippet = text.slice(0, 120).replace(/\s+/g, " ").trim();
          setItems((prev) => {
            const next = prev.map((m) =>
              m.clientId === clientId
                ? {
                    ...m,
                    uploading: false,
                    error: `Server error ${res.status}${snippet ? ": " + snippet : ""}`,
                  }
                : m
            );
            onChange(next);
            return next;
          });
          return;
        }

        if (!res.ok) {
          setItems((prev) => {
            const next = prev.map((m) =>
              m.clientId === clientId
                ? { ...m, uploading: false, error: data.error ?? `Upload failed (${res.status})` }
                : m
            );
            onChange(next);
            return next;
          });
          return;
        }

        setItems((prev) => {
          const next = prev.map((m) =>
            m.clientId === clientId
              ? { ...m, remoteUrl: data.url!, uploading: false }
              : m
          );
          onChange(next);
          return next;
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        setItems((prev) => {
          const next = prev.map((m) =>
            m.clientId === clientId
              ? { ...m, uploading: false, error: `${msg} — try again` }
              : m
          );
          onChange(next);
          return next;
        });
      }
    },
    [folder, onChange]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      // Upload sequentially to avoid FTP connection overlap and stay within timeout
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
    },
    [uploadFile]
  );

  const remove = useCallback(
    async (clientId: string) => {
      const item = items.find((m) => m.clientId === clientId);
      if (!item) return;

      // If already in DB, delete from DB + FTP via API
      if (item.dbId) {
        const res = await fetch("/api/admin/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaId: item.dbId }),
        });
        if (!res.ok) {
          alert("Failed to delete this item. Please try again.");
          return;
        }
      }

      setItems((prev) => {
        let next = prev.filter((m) => m.clientId !== clientId);
        // If we removed the primary image, assign primary to the next available image
        if (item.isPrimary && item.mediaType === "image") {
          const firstImage = next.find((m) => m.mediaType === "image");
          if (firstImage) next = next.map((m) => ({ ...m, isPrimary: m.clientId === firstImage.clientId }));
        }
        next = next.map((m, i) => ({ ...m, sortOrder: i }));
        onChange(next);
        return next;
      });
    },
    [items, onChange]
  );

  const dismissError = useCallback(
    (clientId: string) => {
      sync(items.filter((m) => m.clientId !== clientId));
    },
    [items, sync]
  );

  const setPrimary = useCallback(
    (clientId: string) => {
      sync(items.map((m) => ({ ...m, isPrimary: m.clientId === clientId })));
    },
    [items, sync]
  );

  const moveUp = useCallback(
    (clientId: string) => {
      const idx = items.findIndex((m) => m.clientId === clientId);
      if (idx <= 0) return;
      const next = [...items];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      sync(next.map((m, i) => ({ ...m, sortOrder: i })));
    },
    [items, sync]
  );

  const moveDown = useCallback(
    (clientId: string) => {
      const idx = items.findIndex((m) => m.clientId === clientId);
      if (idx === -1 || idx >= items.length - 1) return;
      const next = [...items];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      sync(next.map((m, i) => ({ ...m, sortOrder: i })));
    },
    [items, sync]
  );

  return (
    <div className="space-y-4">
      {/* Upload buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Images
        </button>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="flex items-center gap-1.5 text-sm font-medium text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Add Video
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      <p className="text-xs text-gray-400">
        Images: jpg / png / webp, max 4 MB each — auto-converted to WebP &nbsp;·&nbsp;
        Videos: mp4 / webm, max 3 MB
      </p>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-400">No media added yet. Click "Add Images" to get started.</p>
        </div>
      )}

      {/* Media grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div
              key={item.clientId}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                item.isPrimary && item.mediaType === "image"
                  ? "border-amber-400 shadow-md"
                  : "border-gray-200"
              }`}
            >
              {/* Preview area */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {item.mediaType === "video" ? (
                  <video
                    src={item.localUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.localUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Uploading overlay */}
                {item.uploading && (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1">
                    <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-white text-xs font-medium">Uploading…</span>
                  </div>
                )}

                {/* Error overlay */}
                {item.error && (
                  <div className="absolute inset-0 bg-red-900/75 flex flex-col items-center justify-center gap-1 p-2">
                    <svg className="w-5 h-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0020.8 16.17L13.93 4.83a2 2 0 00-3.86 0L3.2 16.17A2 2 0 005.07 19z" />
                    </svg>
                    <p className="text-white text-[10px] text-center leading-tight">{item.error}</p>
                    <button
                      type="button"
                      onClick={() => dismissError(item.clientId)}
                      className="mt-1 text-[11px] bg-white text-red-700 px-2 py-0.5 rounded font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Remove button (top-right) */}
                {!item.uploading && !item.error && (
                  <button
                    type="button"
                    onClick={() => remove(item.clientId)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Bottom controls */}
              {!item.uploading && !item.error && (
                <div className="bg-gray-50 px-2 py-1.5 space-y-1.5">
                  {/* Primary badge / button (images only) */}
                  {item.mediaType === "image" && (
                    <button
                      type="button"
                      onClick={() => setPrimary(item.clientId)}
                      className={`w-full text-xs font-medium py-0.5 rounded transition-colors ${
                        item.isPrimary
                          ? "bg-amber-100 text-amber-700 cursor-default"
                          : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      {item.isPrimary ? "★ Primary" : "Set as Primary"}
                    </button>
                  )}
                  {item.mediaType === "video" && (
                    <span className="block text-center text-xs font-medium text-purple-600">
                      🎬 Video
                    </span>
                  )}

                  {/* Position controls */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => moveUp(item.clientId)}
                      disabled={idx === 0}
                      className="flex-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-25 transition-colors text-center"
                      title="Move left"
                    >
                      ← Move
                    </button>
                    <span className="text-xs text-gray-300 px-1">{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => moveDown(item.clientId)}
                      disabled={idx === items.length - 1}
                      className="flex-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-25 transition-colors text-center"
                      title="Move right"
                    >
                      Move →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
