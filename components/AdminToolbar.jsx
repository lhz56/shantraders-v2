"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import LogoutButton from "./LogoutButton";

export default function AdminToolbar({
  onAddProduct,
  onEditProducts,
  sessionOverride,
  sessionLoadingOverride,
}) {
  const router = useRouter();
  const { session: hookSession, loading: hookLoading } = useSupabaseSession();

  const session = sessionOverride ?? hookSession;
  const loading = sessionLoadingOverride ?? hookLoading;
  const email = useMemo(() => session?.user?.email ?? "", [session]);

  if (loading || !session) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex max-w-xs flex-col gap-3 rounded-3xl bg-white/95 p-4 shadow-xl ring-1 ring-inset ring-slate-200 backdrop-blur-sm dark:bg-slate-900/95 dark:ring-slate-700">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Admin
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {email}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
        >
          Admin dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={
              onAddProduct
                ? onAddProduct
                : () => router.push("/admin?view=add")
            }
            className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          >
            Add product
          </button>
          <button
            type="button"
            onClick={
              onEditProducts
                ? onEditProducts
                : () => router.push("/admin?view=edit")
            }
            className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          >
            Edit products
          </button>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
