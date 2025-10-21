"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { session, loading } = useSupabaseSession();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/admin");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading dashboard…</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">
            Admin dashboard
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Welcome back, {session.user?.email}. Use the tools below to manage
            the Shan Traders catalogue.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick actions
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Product management features are coming soon. For now use the
              Supabase dashboard while we finish the in-app experience.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
              >
                View storefront
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard?view=add")}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
              >
                Add product
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard?view=edit")}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
              >
                Edit products
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Session controls
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign out when you are done to keep the dashboard secure.
            </p>
            <LogoutButton className="mt-4" />
          </div>
        </section>
      </div>
    </div>
  );
}
