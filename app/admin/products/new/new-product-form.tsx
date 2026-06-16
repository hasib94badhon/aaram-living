"use client";

import { useActionState, useState } from "react";
import { createProduct } from "@/app/actions/admin";
import MediaUploader, { type MediaItem } from "../_components/media-uploader";

type Category = { id: number; name: string };

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Stable temp folder per form session — uses product listing + random suffix
function makeTempFolder() {
  return `tmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function NewProductForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(createProduct, undefined);
  const [slug, setSlug] = useState("");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  // Stable folder for this form — keeps the same value across re-renders
  const [folder] = useState(() => makeTempFolder());

  const hasUploading = mediaList.some((m) => m.uploading);

  // Serialize only fully uploaded items for the Server Action
  const mediaJson = JSON.stringify(
    mediaList
      .filter((m) => m.remoteUrl && !m.uploading && !m.error)
      .map((m, i) => ({
        url: m.remoteUrl,
        mediaType: m.mediaType,
        isPrimary: m.isPrimary,
        sortOrder: i,
      }))
  );

  return (
    <form action={action} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            onChange={(e) => setSlug(toSlug(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {state?.errors?.name && (
            <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Slug */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
            <span className="ml-1 text-xs text-gray-400 font-normal">(used in URL — auto-filled)</span>
          </label>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {state?.errors?.slug && (
            <p className="mt-1 text-xs text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {state?.errors?.categoryId && (
            <p className="mt-1 text-xs text-red-600">{state.errors.categoryId[0]}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
            <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            name="sku"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (৳) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {state?.errors?.price && (
            <p className="mt-1 text-xs text-red-600">{state.errors.price[0]}</p>
          )}
        </div>

        {/* Sale Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sale Price (৳)
            <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            name="salePrice"
            type="number"
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Media uploader */}
        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Product Media
            <span className="ml-1 text-xs text-gray-400 font-normal">(3–5 images recommended)</span>
          </p>
          {/* Hidden field carries all uploaded media URLs to the Server Action */}
          <input type="hidden" name="mediaJson" value={mediaJson} />
          <MediaUploader folder={folder} onChange={setMediaList} />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Flags */}
        <div className="sm:col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Active (visible in store)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="isFeatured"
              type="checkbox"
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || hasUploading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {hasUploading ? "Waiting for uploads…" : pending ? "Saving…" : "Save Product"}
        </button>
        <a
          href="/admin/products"
          className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
