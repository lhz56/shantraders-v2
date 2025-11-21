"use client";

import { useEffect, useRef, useState } from "react";
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
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current =
      typeof document !== "undefined" ? document.activeElement : null;

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = setTimeout(() => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        firstFocusable?.focus();
      }
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-3 py-6 backdrop-blur"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
        onClick={(event) => event.stopPropagation()}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-700 max-h-[90vh] overflow-y-auto focus:outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          // ✅ Codex visual scale reduction
          className="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-base font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          aria-label="Close"
        >
          ×
        </button>
        <div className="grid gap-0 md:grid-cols-[1fr]">
          <div
            // ✅ Codex visual scale reduction
            className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 md:h-72"
          >
            <Image
              src={imageSrc}
              alt={product.name ?? "Product photo"}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 480px, 100vw"
            />
          </div>
          <div
            // ✅ Codex visual scale reduction
            className="flex flex-col gap-4.5 p-6"
          >
            <div className="space-y-1.5">
              <h2
                // ✅ Codex visual scale reduction
                id="product-modal-title"
                className="text-xl font-semibold text-slate-900 dark:text-slate-100"
              >
                {product.name ?? "Untitled product"}
              </h2>
              <p
                // ✅ Codex visual scale reduction
                id="product-modal-description"
                className="text-xs text-slate-500 dark:text-slate-300"
              >
                Let us know what you&apos;re looking for and our team will reach
                out with availability and pricing information.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <label
                htmlFor="quote-quantity"
                // ✅ Codex visual scale reduction
                className="text-xs font-medium text-slate-700 dark:text-slate-200"
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
                // ✅ Codex visual scale reduction
                className="w-20 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                addItem(product, quantity);
                setConfirmation("Added to your quote cart.");
              }}
              // ✅ Codex visual scale reduction
              className="rounded-md bg-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
            >
              Add to Quote
            </button>
            {confirmation ? (
              <p
                // ✅ Codex visual scale reduction
                className="text-xs text-emerald-600"
              >
                {confirmation}
              </p>
            ) : null}

            <div
              // ✅ Codex visual scale reduction
              className="flex flex-col gap-2.5 sm:flex-row"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                // ✅ Codex visual scale reduction
                className="flex-1 rounded-full bg-emerald-500 px-3.5 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Message on WhatsApp
              </a>
              <a
                href={EMAIL_URL}
                // ✅ Codex visual scale reduction
                className="flex-1 rounded-full border border-slate-200 px-3.5 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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
