"use client";

import { useActionState, useState, useEffect } from "react";
import { createCategory } from "@/app/actions/admin";

type Category = { id: number; name: string };

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AddCategoryForm({
  categories,
}: {
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(createCategory, undefined);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (state?.success) {
      setName("");
      setSlug("");
    }
  }, [state?.success]);

  return (
    <form action={action} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Add Category</h2>

      {state?.success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          Category created successfully.
        </p>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(toSlug(e.target.value));
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          name="slug"
          type="text"
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
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Parent Category */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
            <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
          </label>
          <select
            name="parentId"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">None (top-level)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked
          className="w-4 h-4 text-indigo-600 rounded"
        />
        <span className="text-sm text-gray-700">Active (visible in store)</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {pending ? "Adding…" : "Add Category"}
      </button>
    </form>
  );
}
