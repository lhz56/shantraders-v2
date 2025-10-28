"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error && error.name !== "AuthSessionMissingError") {
      console.error("[auth.signOut]", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
        headers: {
          "Cache-Control": "no-store",
        },
      });
      if (!response.ok) {
        console.warn("[auth.signOut(route)] response not ok", await response.text());
      }
    } catch (routeError) {
      console.warn("[auth.signOut(route)]", routeError);
    }

    router.replace("/");
    router.refresh();
    setLoading(false);
  };

  return (
    <div
      // ✅ Codex visual scale reduction
      className={`flex flex-col items-start gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        // ✅ Codex visual scale reduction
        className="rounded-md bg-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing out..." : "Sign out"}
      </button>
      {error ? (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
