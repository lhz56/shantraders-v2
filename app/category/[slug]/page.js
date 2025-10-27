import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import CategoryListing from "@/components/CategoryListing";
import { slugToCategory, CATEGORY_ORDER, categoryToSlug } from "@/lib/categories";

export const dynamic = "force-dynamic";

async function fetchCategoryProducts(category) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase
    .from("products")
    .select("id, name, image_url, in_stock, is_popular, category")
    .eq("category", category)
    .order("name", { ascending: true });

  if (error) {
    console.error("[category.fetch]", error);
    return [];
  }

  return data ?? [];
}

export default async function CategoryPage({ params }) {
  const category = slugToCategory(params.slug);

  if (!category) {
    return (
      <main className="bg-[#f4f4f7] px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        <section className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">
            Category not found
          </h1>
          <p className="text-sm text-gray-600">
            The category you are looking for does not exist.{" "}
            <Link href="/" className="font-semibold text-brand-600">
              Return to the shop.
            </Link>
          </p>
        </section>
      </main>
    );
  }

  const products = await fetchCategoryProducts(category);

  return (
    <main className="bg-[#f4f4f7] px-4 pb-16 pt-16 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-2 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            {category}
          </h1>
          <p className="text-sm text-gray-600">
            Browse every item we carry in this category. Use the quote cart to request pricing.
          </p>
        </header>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No products available
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please check back later or explore other categories.
            </p>
          </div>
        ) : (
          <CategoryListing products={products} />
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          >
            ← Back to home
          </Link>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((item) => (
              <Link
                key={item}
                href={`/category/${categoryToSlug(item)}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  item === category
                    ? "border-gray-800 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
