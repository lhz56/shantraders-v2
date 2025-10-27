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
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f7]">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f7] px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin dashboard
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Welcome back, {session.user?.email}. Use the tools below to manage
            the Shan Traders catalogue.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick actions
            </h2>
            <p className="mt-2 text-sm text-gray-600">
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

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Session controls
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign out when you are done to keep the dashboard secure.
            </p>
            <LogoutButton className="mt-4" />
          </div>
        </section>
      </div>
    </div>
  );
}
