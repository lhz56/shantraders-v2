"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton({ className = "" }) {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`pointer-events-auto inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:text-sm ${className}`}
    >
      <span>Quote Cart</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 text-xs font-bold text-white">
        {totalCount}
      </span>
    </Link>
  );
}
