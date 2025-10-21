import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductsView from "@/components/ProductsView";
import LogoutButton from "@/components/LogoutButton";

const ADMIN_EMAIL = "shantradersinc@gmail.com";

export const revalidate = 0;
export const dynamic = "force-dynamic";

async function fetchAdminProducts(supabase) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, image_url, in_stock, is_popular")
    .order("name", { ascending: true });

  if (error) {
    if (error.code === "42703") {
      const { data: legacyData, error: legacyError } = await supabase
        .from("products")
        .select("id, name, image_url")
        .order("name", { ascending: true });

      if (legacyError) {
        throw legacyError;
      }

      return (legacyData ?? []).map((item) => ({
        ...item,
        in_stock: true,
        is_popular: false,
      }));
    }

    throw error;
  }

  return (data ?? []).map((item) => ({
    ...item,
    in_stock:
      typeof item.in_stock === "boolean" ? item.in_stock : true,
    is_popular:
      typeof item.is_popular === "boolean" ? item.is_popular : false,
  }));
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const email = session.user?.email?.toLowerCase() ?? "";
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    redirect("/");
  }

  let products = [];
  try {
    products = await fetchAdminProducts(supabase);
  } catch (error) {
    console.error("[admin.products]", error);
  }

  return (
    <main className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-6 rounded-3xl bg-white/90 p-10 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-500">
              Admin Console
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Manage Shan Traders catalogue
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Add new products, update inventory, and curate popular picks in real
              time.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                Signed in as
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {session.user?.email}
              </p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <ProductsView
          initialProducts={products}
          adminEmail={ADMIN_EMAIL}
          prefetchedSession={session}
          forceAdmin
        />
      </section>
    </main>
  );
}
