"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/images";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const WHATSAPP_URL = "https://wa.me/13479058484";
const EMAIL_URL = "mailto:shantradersinc@gmail.com";

export default function ProductModal({ product, onClose }) {
  if (!product) {
    return null;
  }

  const imageSrc = resolveImageUrl(product.image_url);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-10 backdrop-blur-sm">
      <div
        role="presentation"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-700">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 text-lg font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          aria-label="Close"
        >
          ×
        </button>
        <div className="grid gap-0 md:grid-cols-[1fr]">
          <div className="relative h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 md:h-80">
            <Image
              src={imageSrc}
              alt={product.name ?? "Product photo"}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 480px, 100vw"
            />
          </div>
          <div className="flex flex-col gap-6 p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {product.name ?? "Untitled product"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Let us know what you&apos;re looking for and our team will reach
                out with availability and pricing information.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="quote-quantity"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Quantity
              </label>
              <input
                id="quote-quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Math.max(1, Number(event.target.value) || 1))
                }
                className="w-24 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                addItem(product, quantity);
                setConfirmation("Added to your quote cart.");
              }}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
            >
              Add to Quote
            </button>
            {confirmation ? (
              <p className="text-sm text-emerald-600">{confirmation}</p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Message on WhatsApp
              </a>
              <a
                href={EMAIL_URL}
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
