"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton({ className = "" }) {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`pointer-events-auto inline-flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow-sm transition-colors hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 ${className}`}
    >
      <span>Quote Cart</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
        {totalCount}
      </span>
    </Link>
  );
}
