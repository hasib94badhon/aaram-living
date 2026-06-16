"use client";

import { useTransition } from "react";
import { toggleProductVisibility } from "@/app/actions/admin";

export function ProductToggleButton({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    const fd = new FormData();
    fd.set("id", String(id));
    startTransition(() => toggleProductVisibility(fd));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      title={isActive ? "Hide from store" : "Show in store"}
      className={`text-xs font-medium px-2.5 py-1 rounded-lg border disabled:opacity-40 transition-colors ${
        isActive
          ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
          : "border-green-300 text-green-700 hover:bg-green-50"
      }`}
    >
      {pending ? "…" : isActive ? "Hide" : "Show"}
    </button>
  );
}
