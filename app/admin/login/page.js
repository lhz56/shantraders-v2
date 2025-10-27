"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[auth.session]", error);
          return;
        }

        if (data?.session) {
          router.replace("/admin");
          return;
        }
      } catch (error) {
        console.error("[auth.session]", error);
      } finally {
        setCheckingSession(false);
      }
    };

    hydrateSession();
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      console.error("[auth.signIn]", error);
      setError(error.message);
      setSubmitting(false);
      return;
    }

    if (data?.session) {
      setSuccess("Successfully signed in. Redirecting…");
      await supabase.auth.getSession();
      router.replace("/admin");
      return;
    }

    setSubmitting(false);
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f7]">
        <p className="text-sm text-gray-500">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f7] px-4 py-16">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-sm ring-1 ring-gray-200">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Shan Traders Admin
          </h1>
          <p className="text-sm text-gray-600">
            Sign in with your admin credentials to manage the catalogue.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            <p className="text-sm text-slate-500">
              Shan Traders believes in simplicity — clear, fast, and easy.
            </p>
          </div>
        </form>

        <div className="mt-6 space-y-2">
          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-emerald-600" role="status">
              {success}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
