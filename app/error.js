"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("[products.page]", error);
  }, [error]);

  return (
    <main className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl bg-[var(--surface)] p-10 text-center shadow-card ring-1 ring-inset ring-[var(--card-ring)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          !
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          We couldn&apos;t load the products
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Something went wrong while talking to Supabase. You can try again, or
          check the Supabase dashboard to confirm your credentials and table
          setup.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}
