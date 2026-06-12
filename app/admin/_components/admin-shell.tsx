"use client";

import { usePathname } from "next/navigation";
import SidebarNav from "./sidebar-nav";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page renders full-screen without sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-gray-900 flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <p className="text-white font-bold text-base">Aaram Living</p>
          <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
        </div>
        <div className="flex-1 pt-4 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
