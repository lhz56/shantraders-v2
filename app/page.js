import Image from "next/image";
import Link from "next/link";
import logoImage from "@/public/logo.png";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductsView from "@/components/ProductsView";
import CartButton from "@/components/CartButton";
import Footer from "@/components/Footer";
import { categoryToSlug } from "@/lib/categories";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "shantradersinc@gmail.com";
const CATEGORY_OPTIONS = [
  "OTC Medicine",
  "5 hr energy",
  "Deodorant",
  "Rolling papers",
  "Lighters",
  "Incense",
  "Others",
];

export const revalidate = 0;

async function fetchProducts(supabase) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, image_url, in_stock, is_popular, category")
    .order("name", { ascending: true });

  if (error) {
    if (error.code === "42703") {
      console.warn(
        "[products.fetch]",
        "in_stock column not found, falling back to legacy schema."
      );
      const { data: legacyData, error: legacyError } = await supabase
        .from("products")
        .select("id, name, image_url")
        .order("name", { ascending: true });

      if (legacyError) {
        console.error("[products.fetch]", legacyError);
        throw new Error("Failed to load products");
      }

      return (legacyData ?? []).map((item) => ({
        ...item,
        in_stock: true,
        is_popular: false,
        category: CATEGORY_OPTIONS.includes(item.category)
          ? item.category
          : "Others",
      }));
    }

    console.error("[products.fetch]", error);
    throw new Error("Failed to load products");
  }

  return (data ?? []).map((item) => ({
    ...item,
    in_stock:
      typeof item.in_stock === "boolean" ? item.in_stock : true,
    is_popular:
      typeof item.is_popular === "boolean" ? item.is_popular : false,
    category: CATEGORY_OPTIONS.includes(item.category)
      ? item.category
      : "Others",
  }));
}

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const products = await fetchProducts(supabase);

  const isAdmin =
    session?.user?.email &&
    session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const adminCtaLabel = isAdmin ? "Go to Dashboard" : "Admin Login";
  const adminCtaHref = isAdmin ? "/admin" : "/admin/login";

  return (
    <>
      <aside className="pointer-events-auto fixed left-4 top-28 z-30 hidden w-64 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 lg:flex">
        <div className="flex w-full flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">
            Explore
          </p>
          <ul className="space-y-3">
            {CATEGORY_OPTIONS.map((category) => (
              <li key={`sticky-${category}`}>
                <Link
                  href={`/category/${categoryToSlug(category)}`}
                  className="flex items-center justify-between rounded-2xl px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:bg-blue-100/60 hover:text-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-blue-400">▸</span>
                    {category}
                  </span>
                  <span className="text-xs text-blue-400">Browse</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="relative min-h-screen bg-[#f4f4f7] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute right-4 top-6 z-40 flex flex-col gap-2 sm:right-10">
          <div className="flex gap-2">
            <CartButton />
            <Link
              href={adminCtaHref}
              className="pointer-events-auto inline-flex items-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110"
            >
              {adminCtaLabel}
            </Link>
          </div>
        </div>

        <section className="mx-auto flex max-w-7xl flex-col gap-12">
          <header className="rounded-3xl bg-gradient-to-br from-[#eef2ff] to-white p-12 text-center shadow-lg ring-1 ring-slate-200">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-blue-200 bg-white shadow-md">
                <Image
                  src={logoImage}
                  alt="Shan Traders Inc. logo"
                  width={96}
                  height={96}
                  priority
                  className="h-20 w-20 object-contain drop-shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-gray-900 md:text-4xl">
                  Shan Traders Inc.
                </h1>
                <p className="text-sm uppercase tracking-[0.35em] text-blue-500">
                  shantradersinc@gmail.com
                </p>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Premium wholesale goods curated for your storefront. Streamline your inventory without the guesswork.
              </p>
              <div className="mt-6">
                <a
                  href="#catalogue"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Explore Our Catalog
                </a>
              </div>
            </div>
            <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-blue-500 shadow-sm"></div>
          </header>

          <details className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-200 hover:border-blue-300 lg:hidden">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Categories
              <span className="text-blue-400">▾</span>
            </summary>
            <ul className="mt-4 space-y-2">
              {CATEGORY_OPTIONS.map((category) => (
                <li key={`mobile-${category}`}>
                  <Link
                    href={`/category/${categoryToSlug(category)}`}
                    className="flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-blue-400">▸</span>
                      {category}
                    </span>
                    <span className="text-xs text-blue-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <ProductsView
            initialProducts={products}
            prefetchedSession={session}
            adminEmail={ADMIN_EMAIL}
          />
        </section>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-gray-900/10 to-transparent px-4 py-4 lg:hidden">
        <CartButton className="max-w-sm flex-1 justify-center" />
      </div>
      <Footer />
    </>
  );
}
