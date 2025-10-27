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
    <main className="bg-[#f4f4f7] px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-gray-900">
            Quote Cart
          </h1>
          <p className="text-sm text-gray-600">
            Review your selected products and send us a request for pricing.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Items ({totalCount})
            </h2>

            {items.length === 0 ? (
              <p className="text-sm text-gray-500">
                Your quote cart is empty. Browse products to add items.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
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
                        <p className="text-sm font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                          Product ID: {item.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                          >
                            −
                          </button>
                          <span className="min-w-[2ch] px-3 text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
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

          <aside className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Request a Quote
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quote-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="quote-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="you@company.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quote-company"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name
                </label>
                <input
                  id="quote-company"
                  type="text"
                  required
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
