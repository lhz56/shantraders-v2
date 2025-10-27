"use client";

import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/lib/images";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { CATEGORY_ORDER } from "@/lib/categories";

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cx(
        "flex items-center justify-between rounded-md px-4 py-2 text-sm font-semibold transition-colors shadow-sm",
        checked
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300",
        disabled && "cursor-not-allowed opacity-60"
      )}
      disabled={disabled}
    >
      <span>{label}</span>
      <span
        className={cx(
          "relative inline-flex h-5 w-10 items-center rounded-full transition",
          checked ? "bg-emerald-300" : "bg-gray-300"
        )}
      >
        <span
          className={cx(
            "inline-block h-4 w-4 rounded-full bg-white transition shadow",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </span>
    </button>
  );
}

export default function ProductFormModal({
  open,
  title,
  initialData,
  submitting,
  deleting = false,
  error,
  onClose,
  onSubmit,
  onDelete = null,
}) {
  const [name, setName] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [category, setCategory] = useState(CATEGORY_ORDER[0]);

  useEffect(() => {
    if (!open) return;

    setName(initialData?.name ?? "");
    setInStock(
      typeof initialData?.in_stock === "boolean" ? initialData.in_stock : true
    );
    setIsPopular(
      typeof initialData?.is_popular === "boolean"
        ? initialData.is_popular
        : false
    );
    setCategory(
      CATEGORY_ORDER.includes(initialData?.category)
        ? initialData.category
        : CATEGORY_ORDER[0]
    );
    setFile(null);
    const resolved = initialData?.image_url
      ? resolveImageUrl(initialData.image_url)
      : "";
    setPreviewUrl(resolved);
  }, [open, initialData]);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const disabled = submitting || deleting;
  const isEditable = Boolean(initialData?.id);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
      const resolved = initialData?.image_url
        ? resolveImageUrl(initialData.image_url)
        : "";
      setPreviewUrl(resolved);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled) return;
    onSubmit({
      name,
      in_stock: inStock,
      is_popular: isPopular,
      category,
      file,
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-12 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-200 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          aria-label="Close"
          disabled={disabled}
        >
          ×
        </button>

        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            {isEditable
              ? "Update the product details below."
              : "Add a new product to the Shan Traders catalogue."}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <label
              htmlFor="product-name"
              className="text-sm font-medium text-slate-700"
            >
              Product name
            </label>
            <input
              id="product-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={disabled}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-50"
              placeholder="Enter product name"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-slate-700">
              Product image
            </span>
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={name || "Product preview"}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-xl border border-slate-200 border-dashed text-sm text-slate-400">
                  No image selected
                </div>
              )}

              <label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                <span>{file ? "Change image" : "Upload image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={disabled}
                />
              </label>
              <p className="text-xs text-slate-400">
                Recommended size 600×400px. Accepted formats: PNG, JPG, WebP.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-slate-700">
              Availability
            </span>
            <Toggle
              label={inStock ? "In stock" : "Out of stock"}
              checked={inStock}
              onChange={setInStock}
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-slate-700">
              Popular pick
            </span>
            <Toggle
              label={isPopular ? "Featured in popular picks" : "Not featured"}
              checked={isPopular}
              onChange={setIsPopular}
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="product-category"
              className="text-sm font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="product-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={disabled}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              {CATEGORY_ORDER.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isEditable && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (disabled) return;
                  if (
                    typeof window !== "undefined" &&
                    window.confirm(
                      "Are you sure you want to delete this product? This action cannot be undone."
                    )
                  ) {
                    onDelete();
                  }
                }}
                disabled={disabled}
                className="order-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 sm:order-1"
              >
                {deleting ? "Deleting…" : "Delete product"}
              </button>
            ) : null}

            <div className="order-1 flex w-full flex-col gap-2 sm:order-2 sm:w-auto">
              <button
                type="submit"
                disabled={disabled}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving…"
                  : isEditable
                  ? "Save changes"
                  : "Create product"}
              </button>
              <p className="text-sm text-slate-500">
                Shan Traders believes in simplicity — clear, fast, and easy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
