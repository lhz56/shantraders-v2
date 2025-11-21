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
      <main
        // ✅ Codex visual scale reduction
        className="bg-[#f4f4f7] px-3.5 pb-14 pt-14 sm:px-5 lg:px-7"
      >
        <section
          // ✅ Codex visual scale reduction
          className="mx-auto flex max-w-2xl flex-col gap-3.5 rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100"
        >
          <h1
            // ✅ Codex visual scale reduction
            className="text-xl font-semibold text-gray-900"
          >
            Category not found
          </h1>
          <p
            // ✅ Codex visual scale reduction
            className="text-xs text-gray-600"
          >
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
    <main
      // ✅ Codex visual scale reduction
      className="bg-[#f4f4f7] px-3.5 pb-14 pt-14 sm:px-5 lg:px-7"
    >
      <section
        // ✅ Codex visual scale reduction
        className="mx-auto flex max-w-5xl flex-col gap-6"
      >
        <header
          // ✅ Codex visual scale reduction
          className="flex flex-col gap-1.5 border-b border-gray-200 pb-5"
        >
          <h1
            // ✅ Codex visual scale reduction
            className="text-2xl font-semibold text-gray-900"
          >
            {category}
          </h1>
          <p
            // ✅ Codex visual scale reduction
            className="text-xs text-gray-600"
          >
            Browse every item we carry in this category. Use the quote cart to request pricing.
          </p>
        </header>

        {/* ✅ Category nav moved above products (non-sticky) */}
        <nav
          aria-label="Category navigation"
          className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100"
        >
          <Link
            href="/"
            // ✅ Codex visual scale reduction
            className="inline-flex items-center rounded-md bg-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300"
          >
            ← Back to home
          </Link>
          <div className="mt-3 overflow-x-auto whitespace-nowrap no-scrollbar">
            {CATEGORY_ORDER.map((item) => (
              <Link
                key={item}
                href={`/category/${categoryToSlug(item)}`}
                // ✅ Codex visual scale reduction
                className={`mr-2 inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium transition ${
                  item === category
                    ? "border-gray-800 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </nav>

        {products.length === 0 ? (
          <div
            // ✅ Codex visual scale reduction
            className="rounded-xl border border-dashed border-gray-200 bg-white p-9 text-center shadow-sm"
          >
            <h2
              // ✅ Codex visual scale reduction
              className="text-lg font-semibold text-gray-900"
            >
              No products available
            </h2>
            <p
              // ✅ Codex visual scale reduction
              className="mt-1.5 text-xs text-gray-600"
            >
              Please check back later or explore other categories.
            </p>
          </div>
        ) : (
          <CategoryListing products={products} />
        )}

      </section>
    </main>
  );
}
