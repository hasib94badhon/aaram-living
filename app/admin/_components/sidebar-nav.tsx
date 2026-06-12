"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products", exact: false },
  { href: "/admin/categories", label: "Categories", exact: false },
  { href: "/admin/orders", label: "Orders", exact: false },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full px-3 pb-4">
      <ul className="space-y-1 flex-1">
        {NAV.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <form action={logout} className="mt-auto">
        <button
          type="submit"
          className="w-full text-left px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          Logout
        </button>
      </form>
    </nav>
  );
}
