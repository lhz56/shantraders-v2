"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

export default function CategoryListing({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { session } = useSupabaseSession();
  const adminEmail = "shantradersinc@gmail.com";
  const isAdmin =
    session?.user?.email &&
    session.user.email.toLowerCase() === adminEmail.toLowerCase();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onSelect={setSelectedProduct}
          />
        ))}
      </div>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
