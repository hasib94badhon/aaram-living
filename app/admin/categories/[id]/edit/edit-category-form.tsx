"use client";

import { useActionState, useState } from "react";
import { updateCategory } from "@/app/actions/admin";

type CategoryData = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditCategoryForm({ category }: { category: CategoryData }) {
  const [state, action, pending] = useActionState(updateCategory, undefined);
  const [slug, setSlug] = useState(category.slug);

  return (
    <form action={action} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-lg">
      <input type="hidden" name="id" value={category.id} />

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={category.name}
          onChange={(e) => setSlug(toSlug(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div>
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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
          <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={category.description ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={category.isActive}
          className="w-4 h-4 text-indigo-600 rounded"
        />
        <span className="text-sm text-gray-700">Active (visible in store)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <a
          href="/admin/categories"
          className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
