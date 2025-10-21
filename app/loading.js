export default function Loading() {
  return (
    <main className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4">
          <span className="inline-flex h-10 w-36 animate-pulse rounded-full bg-slate-200/70" />
          <span className="h-12 w-3/4 animate-pulse rounded-2xl bg-slate-200/80 sm:w-2/3" />
          <span className="h-4 w-full animate-pulse rounded-full bg-slate-200/70 sm:w-1/2" />
          <span className="h-4 w-full animate-pulse rounded-full bg-slate-200/60 sm:w-1/3" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/80 shadow-card ring-1 ring-inset ring-[var(--card-ring)]"
            >
              <div className="aspect-[4/3] w-full animate-pulse bg-slate-200/70" />
              <div className="flex flex-1 flex-col gap-4 px-6 py-6">
                <span className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200/80" />
                <span className="h-4 w-full animate-pulse rounded-full bg-slate-200/70" />
                <span className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200/60" />
                <div className="mt-auto flex items-center justify-between">
                  <span className="h-6 w-24 animate-pulse rounded-full bg-slate-200/80" />
                  <span className="h-6 w-16 animate-pulse rounded-full bg-slate-200/70" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
