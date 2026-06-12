"use client";

import { useActionState, useState } from "react";
import { updateProduct } from "@/app/actions/admin";

type Category = { id: number; name: string };
type ProductData = {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
  images: string[];   // ordered: primary first, up to 3
  isActive: boolean;
  isFeatured: boolean;
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditProductForm({
  product,
  categories,
}: {
  product: ProductData;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(updateProduct, undefined);
  const [slug, setSlug] = useState(product.slug);

  return (
    <form action={action} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
      <input type="hidden" name="id" value={product.id} />

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
            defaultValue={product.name}
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
            <span className="ml-1 text-xs text-gray-400 font-normal">(URL identifier)</span>
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
            defaultValue={product.categoryId}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
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
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
          <input
            name="sku"
            type="text"
            defaultValue={product.sku}
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
            defaultValue={product.price}
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
            defaultValue={product.salePrice ?? ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product.stock}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Images */}
        <div className="sm:col-span-2 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Product Images
            <span className="ml-1 text-xs text-gray-400 font-normal">(up to 3 URLs — first is the main image)</span>
          </p>
          {(["imageUrl1", "imageUrl2", "imageUrl3"] as const).map((field, i) => (
            <div key={field} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 w-16 shrink-0">
                {i === 0 ? "Main" : `Image ${i + 1}`}
              </span>
              <input
                name={field}
                type="url"
                placeholder="https://..."
                defaultValue={product.images[i] ?? ""}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Flags */}
        <div className="sm:col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={product.isActive}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Active (visible in store)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={product.isFeatured}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : "Save Changes"}
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
