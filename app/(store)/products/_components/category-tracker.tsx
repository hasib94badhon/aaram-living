"use client";

import { useEffect } from "react";
import { incrementCategoryView } from "@/app/actions/tracking";

export default function CategoryTracker({
  categorySlug,
}: {
  categorySlug: string;
}) {
  useEffect(() => {
    incrementCategoryView(categorySlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
