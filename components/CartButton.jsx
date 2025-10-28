"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton({ className = "" }) {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      // ✅ Codex visual scale reduction
      className={`pointer-events-auto inline-flex min-h-[2.35rem] items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:text-xs ${className}`}
    >
      <span>Quote Cart</span>
      <span
        // ✅ Codex visual scale reduction
        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[0.7rem] font-bold text-white"
      >
        {totalCount}
      </span>
    </Link>
  );
}
