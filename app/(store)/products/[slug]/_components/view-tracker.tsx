"use client";

import { useEffect } from "react";
import { incrementProductView } from "@/app/actions/tracking";

export default function ViewTracker({ productId }: { productId: number }) {
  useEffect(() => {
    incrementProductView(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
