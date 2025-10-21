import Image from "next/image";
import Link from "next/link";
import logoImage from "@/public/logo.png";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductsView from "@/components/ProductsView";
import CartButton from "@/components/CartButton";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "shantradersinc@gmail.com";

export const revalidate = 0;

async function fetchProducts(supabase) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, image_url, in_stock, is_popular")
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
      <main className="relative px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute right-4 top-4 z-40 flex flex-col gap-2 sm:right-8 sm:top-6">
          <div className="flex gap-2">
            <CartButton />
            <Link
              href={adminCtaHref}
              className="pointer-events-auto inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow-sm transition-colors hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {adminCtaLabel}
            </Link>
          </div>
        </div>

        <section className="mx-auto flex max-w-6xl flex-col gap-12">
          <header className="overflow-hidden rounded-3xl bg-white/80 p-10 text-center shadow-sm ring-1 ring-inset ring-slate-200/60 backdrop-blur dark:bg-slate-900/70 dark:ring-slate-700/60">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white shadow-sm ring-4 ring-white/70 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-900/80">
                <Image
                  src={logoImage}
                  alt="Shan Traders Inc. logo"
                  width={96}
                  height={96}
                  priority
                  className="h-20 w-20 object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-wide text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl md:tracking-[0.08em] md:font-black font-serif">
                  Shan Traders Inc.
                </h1>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  Shantradersinc@gmail.com
                </p>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Contact Us on WhatsApp: 3479058484
              </p>
            </div>
          </header>

          <ProductsView
            initialProducts={products}
            prefetchedSession={session}
            adminEmail={ADMIN_EMAIL}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
