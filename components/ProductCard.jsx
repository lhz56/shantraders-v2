"use client";

import Image from "next/image";
import { resolveImageUrl } from "@/lib/images";

export default function ProductCard({
  product,
  onEdit,
  onSelect,
  isAdmin = false,
}) {
  const imageSrc = resolveImageUrl(product.image_url);
  const outOfStock = product.in_stock === false;
  const isPopular = product.is_popular === true;

  return (
    <article
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-[var(--surface)] shadow-card ring-1 ring-inset ring-[var(--card-ring)] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200 dark:bg-slate-900/80"
      onClick={() => onSelect?.(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(product);
        }
      }}
    >
      <div className="pointer-events-none relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name ?? "Product photo"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 384px, (min-width: 640px) 50vw, 100vw"
          priority={false}
        />
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Out of stock
          </span>
        ) : null}
        {isPopular ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <span>★</span>
            Popular
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col items-start gap-4 px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-brand-600 dark:text-slate-100">
          {product.name ?? "Untitled product"}
        </h2>
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          Product
        </span>
      </div>

      {isAdmin ? (
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(product);
            }}
            className="rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          >
            Edit
          </button>
        </div>
      ) : null}
    </article>
  );
}
