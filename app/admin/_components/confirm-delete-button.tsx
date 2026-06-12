"use client";

import { useTransition } from "react";

export function ConfirmDeleteButton({
  action,
  id,
  message,
  disabled,
  disabledTitle,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  message: string;
  disabled?: boolean;
  disabledTitle?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending || disabled}
      title={disabled ? disabledTitle : undefined}
      onClick={() => {
        if (!confirm(message)) return;
        const fd = new FormData();
        fd.set("id", String(id));
        startTransition(() => action(fd));
      }}
      className="text-red-500 hover:underline text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
