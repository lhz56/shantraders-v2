"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/images";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdcJ_LlaI-YICk2RnWeR-xs96_xCKPRFOzr9LHYIT1Zauu-yw/viewform?usp=sharing&ouid=111242212280830611177";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalCount } = useCart();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleQuantityChange = (id, delta) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    updateQuantity(id, Math.max(1, target.quantity + delta));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();

    if (items.length === 0) {
      setError("Add at least one product before submitting a request.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!trimmedCompany) {
      setError("Company name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          company: trimmedCompany,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit quote request.");
      }

      setMessage("Thanks — redirecting to verification form...");
      clearCart();
      setTimeout(() => {
        window.location.href = GOOGLE_FORM_URL;
      }, 1200);
    } catch (err) {
      console.error("[quote.submit]", err);
      setError("Failed to submit request — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="px-4 pb-16 pt-16 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Quote Cart
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review your selected products and send us a request for pricing.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4 rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Items ({totalCount})
            </h2>

            {items.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your quote cart is empty. Browse products to add items.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-slate-700"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={resolveImageUrl(item.image_url)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Product ID: {item.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-200 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            −
                          </button>
                          <span className="min-w-[2ch] px-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-200 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-md bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Request a Quote
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quote-email"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  id="quote-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                  placeholder="you@company.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quote-company"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Company Name
                </label>
                <input
                  id="quote-company"
                  type="text"
                  required
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                  placeholder="Shan Traders Partner LLC"
                />
              </div>

              {error ? (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
              <p className="text-xs text-slate-500">
                Shan Traders believes in simplicity — clear, fast, and easy.
              </p>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}
