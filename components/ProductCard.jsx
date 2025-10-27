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
  const category = product.category;

  const ribbon = isPopular
    ? { text: "Popular", classes: "bg-[#e0edff] text-[#2563eb]" }
    : outOfStock
    ? { text: "Out of stock", classes: "bg-gray-300 text-gray-700" }
    : null;

  const handleQuote = (event) => {
    event.stopPropagation();
    onSelect?.(product);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit?.(product);
  };

  return (
    <article
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
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
      <div className="pointer-events-none relative aspect-[4/3] w-full overflow-hidden border-b border-gray-100 bg-gray-50">
        <Image
          src={imageSrc}
          alt={product.name ?? "Product photo"}
          fill
          className="rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 384px, (min-width: 640px) 50vw, 100vw"
          priority={false}
        />
        {ribbon ? (
          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm ${ribbon.classes}`}
          >
            {ribbon.text}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
          {product.name ?? "Untitled product"}
        </h2>
        {category ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm">
            <span className="text-blue-400">#</span>
            {category}
          </span>
        ) : null}
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          Quote available
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={handleQuote}
          className="inline-flex items-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
        >
          Request Quote
        </button>
        {isAdmin ? (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-300"
          >
            Edit
          </button>
        ) : null}
      </div>
    </article>
  );
}
