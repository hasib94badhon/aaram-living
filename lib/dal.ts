import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Use inside Server Components / Server Actions to get the current session.
// React cache() ensures the cookie is only read once per request.
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session;
});

// Use inside admin Server Components / Server Actions.
export const verifyAdmin = cache(async () => {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") redirect("/admin/login");
  return session;
});
