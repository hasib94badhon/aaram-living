"use client";

import { useFormStatus } from "react-dom";
import { updateOrderStatus } from "@/app/actions/admin";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors min-w-[44px]"
    >
      {pending ? "…" : "Save"}
    </button>
  );
}

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  return (
    <form action={updateOrderStatus} className="flex gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <SaveButton />
    </form>
  );
}
