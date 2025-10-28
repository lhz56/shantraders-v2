"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import ProductCard from "./ProductCard";
import ProductFormModal from "./ProductFormModal";
import AdminToolbar from "./AdminToolbar";
import ProductModal from "./ProductModal";
import { extractStoragePath } from "@/lib/images";
import { CATEGORY_ORDER, categoryToSlug } from "@/lib/categories";

const ADMIN_EMAIL = "shantradersinc@gmail.com";

function sortByName(items) {
  return [...items].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", undefined, {
      sensitivity: "base",
    })
  );
}

function createFilePath(file) {
  const originalName = file.name ?? "upload";
  const extension = originalName.includes(".")
    ? originalName.slice(originalName.lastIndexOf(".") + 1).toLowerCase()
    : "png";
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedBase =
    baseName.replace(/[^a-zA-Z0-9_-]/g, "").replace(/\s+/g, "-").toLowerCase() ||
    "product";
  const uniqueSuffix =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now();
  return `products/${sanitizedBase}-${uniqueSuffix}.${extension}`;
}

export default function ProductsView({
  initialProducts,
  adminEmail = ADMIN_EMAIL,
  prefetchedSession = null,
  forceAdmin = false,
}) {
  const [products, setProducts] = useState(() => sortByName(initialProducts));
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { session, loading: hookLoading } = useSupabaseSession();
  const effectiveSession = session ?? prefetchedSession;
  const isAdmin =
    forceAdmin ||
    Boolean(
      effectiveSession?.user?.email &&
        effectiveSession.user.email.toLowerCase() === adminEmail.toLowerCase()
    );
  const sessionLoading = forceAdmin ? false : hookLoading && !effectiveSession;

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(""), 4000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const handleAddProduct = useCallback(
    async (payload) => {
      if (!isAdmin) {
        return;
      }

      setAddSubmitting(true);
      setAddError("");

      try {
        let imageUrl = "";
        if (payload.file) {
          const filePath = createFilePath(payload.file);
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, payload.file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw uploadError;
          }

          const { data: publicData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);
          imageUrl = publicData?.publicUrl ?? "";
        }

        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              name: payload.name.trim(),
              image_url: imageUrl || null,
              in_stock:
                typeof payload.in_stock === "boolean" ? payload.in_stock : true,
              is_popular:
                typeof payload.is_popular === "boolean"
                  ? payload.is_popular
                  : false,
              category: payload.category,
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProducts((previous) => sortByName([data, ...previous]));
        setFeedback("Product added successfully.");
        setAddOpen(false);
      } catch (error) {
        console.error("[products.add]", error);
        setAddError(error.message ?? "Failed to add product.");
      } finally {
        setAddSubmitting(false);
      }
    },
    [setProducts, isAdmin]
  );

  const handleEditProduct = useCallback(
    async (payload) => {
      if (!isAdmin || !editProduct) return;

      setEditSubmitting(true);
      setEditError("");

      try {
        let imageUrl = editProduct.image_url ?? "";
        let oldImagePath = null;

        if (payload.file) {
          const filePath = createFilePath(payload.file);
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, payload.file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw uploadError;
          }

          const { data: publicData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);
          imageUrl = publicData?.publicUrl ?? imageUrl;
          oldImagePath = extractStoragePath(editProduct.image_url);
        }

        const { data, error } = await supabase
          .from("products")
          .update({
            name: payload.name.trim(),
            image_url: imageUrl,
            in_stock:
              typeof payload.in_stock === "boolean"
                ? payload.in_stock
                : editProduct.in_stock,
            is_popular:
              typeof payload.is_popular === "boolean"
                ? payload.is_popular
                : editProduct.is_popular,
            category: payload.category ?? editProduct.category,
          })
          .eq("id", editProduct.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (oldImagePath) {
          const { error: removeError } = await supabase.storage
            .from("product-images")
            .remove([oldImagePath]);
          if (removeError) {
            console.warn("[products.edit]", "Failed to delete old image", removeError);
          }
        }

        setProducts((previous) =>
          sortByName(
            previous.map((item) => (item.id === data.id ? data : item))
          )
        );
        setFeedback("Product updated successfully.");
        setEditProduct(null);
      } catch (error) {
        console.error("[products.edit]", error);
        setEditError(error.message ?? "Failed to update product.");
      } finally {
        setEditSubmitting(false);
      }
    },
    [editProduct, isAdmin]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!isAdmin || !editProduct) return;

    setDeleteSubmitting(true);
    setEditError("");

    try {
      const storagePath = extractStoragePath(editProduct.image_url);

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", editProduct.id);

      if (error) {
        throw error;
      }

      if (storagePath) {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove([storagePath]);
        if (removeError) {
          console.warn("[products.delete]", removeError);
        }
      }

      setProducts((previous) =>
        previous.filter((item) => item.id !== editProduct.id)
      );
      setFeedback("Product deleted successfully.");
      setEditProduct(null);
    } catch (error) {
      console.error("[products.delete]", error);
      setEditError(error.message ?? "Failed to delete product.");
    } finally {
      setDeleteSubmitting(false);
    }
  }, [editProduct, isAdmin, setProducts]);

  const visibleProducts = useMemo(() => {
    if (isAdmin) {
      return products;
    }

    return products.filter((product) => product.in_stock !== false);
  }, [products, isAdmin]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return visibleProducts;
    }
    return visibleProducts.filter((product) =>
      (product.name ?? "")
        .toString()
        .toLowerCase()
        .includes(query)
    );
  }, [visibleProducts, searchQuery]);

  const popularProducts = useMemo(() => {
    const filtered = filteredProducts.filter(
          (product) => product.is_popular === true
    );
    return sortByName(filtered);
  }, [filteredProducts]);

  return (
    <div id="catalogue" className="flex flex-col gap-8">
      {feedback ? (
        <div className="pointer-events-auto fixed bottom-6 left-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl bg-emerald-600/95 px-5 py-4 text-sm text-white shadow-2xl ring-1 ring-emerald-300/40">
          <div className="flex-1">
            <p className="font-semibold">Success</p>
            <p className="mt-1 text-xs text-emerald-50">{feedback}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback("")}
            className="rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      ) : null}

      <div
        // ✅ Codex visual scale reduction
        className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-xl"
      >
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
            🔍
          </span>
          <input
            id="product-search"
            type="search"
            placeholder="Search for Tylenol, Advil..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            // ✅ Codex visual scale reduction
            className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-5 py-2.5 text-xs text-gray-700 shadow-md placeholder:text-[#94a3b8] transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
          />
        </div>
      </div>

      <div
        // ✅ Codex visual scale reduction
        className="mx-auto w-full max-w-4xl"
      >
        <div
          // ✅ Codex visual scale reduction
          className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-blue-100 bg-white/90 p-3 shadow-sm ring-1 ring-blue-100 backdrop-blur"
        >
          {CATEGORY_ORDER.map((category) => (
            <Link
              key={`pill-${category}`}
              href={`/category/${categoryToSlug(category)}`}
              // ✅ Codex visual scale reduction
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
            >
              <span>{category}</span>
              <span
                // ✅ Codex visual scale reduction
                className="text-[0.65rem] font-semibold text-blue-400 transition-colors duration-200 group-hover:text-blue-600"
              >
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {popularProducts.length > 0 ? (
        <section
          // ✅ Codex visual scale reduction
          className="mb-10 flex flex-col gap-3 rounded-3xl border border-blue-100 bg-white p-5 shadow-md"
        >
          <div className="flex flex-col gap-1.5">
            <h2
              // ✅ Codex visual scale reduction
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              ⭐ Popular Items
            </h2>
            <p
              // ✅ Codex visual scale reduction
              className="text-xs text-gray-500"
            >
              Hand-selected favorites from the Shan Traders catalogue.
            </p>
            <p
              // ✅ Codex visual scale reduction
              className="text-xs text-gray-400"
            >
              Hand-picked favorites trusted by our regular customers.
            </p>
          </div>

          <div
            // ✅ Codex visual scale reduction
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {popularProducts.map((product) => (
              <ProductCard
                key={`popular-${product.id}`}
                product={product}
                onEdit={(item) => setEditProduct(item)}
                isAdmin={isAdmin}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div
        // ✅ Codex visual scale reduction
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <h2
          // ✅ Codex visual scale reduction
          className="text-lg font-bold tracking-tight text-gray-900"
        >
          Browse Catalogue
        </h2>
        <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
          {filteredProducts.length} items
        </p>
      </div>

      {visibleProducts.length === 0 ? (
        <div
          // ✅ Codex visual scale reduction
          className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm"
        >
          <h2
            // ✅ Codex visual scale reduction
            className="text-lg font-semibold text-gray-900"
          >
            No products yet
          </h2>
          <p
            // ✅ Codex visual scale reduction
            className="mt-1.5 text-xs text-gray-600"
          >
            Add products in Supabase to see them appear here instantly.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          // ✅ Codex visual scale reduction
          className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-xs text-gray-500 shadow-sm"
        >
          No products match “{searchQuery.trim()}”. Try a different name.
        </div>
      ) : (
        CATEGORY_ORDER.map((category) => {
          const itemsInCategory = filteredProducts.filter(
            (product) => product.category === category
          );

          if (itemsInCategory.length === 0) {
            return null;
          }

          const preview = itemsInCategory.slice(0, 3);
          const slug = categoryToSlug(category);

          return (
            <section
              key={category}
              // ✅ Codex visual scale reduction
              className="mb-10 flex flex-col gap-3.5 rounded-3xl border border-gray-200 bg-white p-5 shadow-md last:mb-0"
            >
              <div className="flex items-center justify-between">
                <h3
                  // ✅ Codex visual scale reduction
                  className="text-xl font-semibold uppercase tracking-wide text-gray-900"
                >
                  {category}
                </h3>
                {itemsInCategory.length > preview.length ? (
                  <Link
                    href={`/category/${slug}`}
                    // ✅ Codex visual scale reduction
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                  >
                    {isAdmin ? "View category" : "Show More →"}
                  </Link>
                ) : null}
              </div>
              <div
                // ✅ Codex visual scale reduction
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {preview.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={(item) => setEditProduct(item)}
                    isAdmin={isAdmin}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      {isAdmin ? (
        <div className="block sm:hidden">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-800 shadow-lg ring-4 ring-gray-200/60 transition hover:bg-gray-300"
          >
            +
          </button>
        </div>
      ) : null}

      <ProductFormModal
        open={addOpen}
        title="Add product"
        initialData={null}
        submitting={addSubmitting}
        deleting={false}
        error={addError}
        onClose={() => {
          if (!addSubmitting) {
            setAddOpen(false);
            setAddError("");
          }
        }}
        onSubmit={handleAddProduct}
        onDelete={null}
      />

      <ProductFormModal
        open={Boolean(editProduct)}
        title="Edit product"
        initialData={editProduct}
        submitting={editSubmitting}
        deleting={deleteSubmitting}
        error={editError}
        onClose={() => {
          if (!editSubmitting && !deleteSubmitting) {
            setEditProduct(null);
            setEditError("");
          }
        }}
        onSubmit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {isAdmin ? (
        <AdminToolbar
          onAddProduct={() => setAddOpen(true)}
          onEditProducts={() => setAddOpen(false)}
          sessionOverride={effectiveSession}
          sessionLoadingOverride={sessionLoading}
        />
      ) : null}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
