"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import ProductFormModal from "./ProductFormModal";
import { supabase } from "@/lib/supabaseClient";
import { extractStoragePath } from "@/lib/images";
import AdminToolbar from "./AdminToolbar";

export default function CategoryListing({ products }) {
  const { session, loading: sessionLoading } = useSupabaseSession();
  const adminEmail = "shantradersinc@gmail.com";
  const isAdmin =
    session?.user?.email &&
    session.user.email.toLowerCase() === adminEmail.toLowerCase();

  const sortByName = useCallback((items) => {
    return [...items].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? "", undefined, {
        sensitivity: "base",
      })
    );
  }, []);

  const [items, setItems] = useState(() => sortByName(products ?? []));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    setItems(sortByName(products ?? []));
  }, [products, sortByName]);

  const createFilePath = useCallback((file) => {
    const originalName = file.name ?? "upload";
    const extension = originalName.includes(".")
      ? originalName.slice(originalName.lastIndexOf(".") + 1).toLowerCase()
      : "png";
    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase() || "product";
    const uniqueSuffix =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now();
    return `products/${baseName}-${uniqueSuffix}.${extension}`;
  }, []);

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
                typeof payload.in_stock === "boolean"
                  ? payload.in_stock
                  : true,
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

        setItems((previous) => sortByName([data, ...previous]));
        setAddOpen(false);
      } catch (error) {
        console.error("[category.add]", error);
        setAddError(error.message ?? "Failed to add product.");
      } finally {
        setAddSubmitting(false);
      }
    },
    [createFilePath, isAdmin, sortByName]
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
            console.warn(
              "[category.edit]",
              "Failed to delete old image",
              removeError
            );
          }
        }

        setItems((previous) =>
          sortByName(
            previous.map((item) => (item.id === data.id ? data : item))
          )
        );
        setSelectedProduct((current) =>
          current?.id === data.id ? data : current
        );
        setEditProduct(null);
      } catch (error) {
        console.error("[category.edit]", error);
        setEditError(error.message ?? "Failed to update product.");
      } finally {
        setEditSubmitting(false);
      }
    },
    [createFilePath, editProduct, isAdmin, sortByName]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!isAdmin || !editProduct) return;

    setDeleteSubmitting(true);
    setEditError("");

    try {
      let removePath = extractStoragePath(editProduct.image_url);

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", editProduct.id);

      if (error) {
        throw error;
      }

      if (removePath) {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove([removePath]);
        if (removeError) {
          console.warn(
            "[category.delete]",
            "Failed to delete image",
            removeError
          );
        }
      }

      setItems((previous) =>
        previous.filter((item) => item.id !== editProduct.id)
      );
      setSelectedProduct((current) =>
        current?.id === editProduct.id ? null : current
      );
      setEditProduct(null);
    } catch (error) {
      console.error("[category.delete]", error);
      setEditError(error.message ?? "Failed to delete product.");
    } finally {
      setDeleteSubmitting(false);
    }
  }, [editProduct, isAdmin]);

  const effectiveItems = useMemo(() => sortByName(items), [items, sortByName]);

  return (
    <>
      <div
        // ✅ Codex visual scale reduction
        className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {effectiveItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onEdit={(item) => setEditProduct(item)}
            onSelect={setSelectedProduct}
          />
        ))}
      </div>

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
          sessionOverride={session}
          sessionLoadingOverride={sessionLoading}
        />
      ) : null}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
