"use client";

import Link from "next/link";

const email = "shantradersinc@gmail.com";
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      // ✅ Codex visual scale reduction
      className="mt-10 border-t border-gray-200 bg-[#f4f4f7] py-6 text-xs text-[#64748b]"
    >
      <div
        // ✅ Codex visual scale reduction
        className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-5 md:flex-row md:items-start md:justify-between lg:px-7"
      >
        <div className="space-y-2">
          <p
            // ✅ Codex visual scale reduction
            className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-400"
          >
            Contact
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110"
          >
            Admin Login
          </Link>
          <p>
            Email:{" "}
            <a
              href={`mailto:${email}`}
              className="font-medium text-gray-800 underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </p>
        </div>
        <div
          // ✅ Codex visual scale reduction
          className="space-y-1.5 text-xs md:text-right"
        >
          <p
            // ✅ Codex visual scale reduction
            className="text-[0.65rem] uppercase tracking-[0.25em] text-gray-400"
          >
            Shan Traders Inc.
          </p>
          <p>&copy; {year} Shan Traders Inc. All rights reserved.</p>
          <p
            // ✅ Codex visual scale reduction
            className="text-[0.7rem] text-gray-500 md:text-xs"
          >
            Note: All new customers must provide valid business registration
            information and a tax ID before purchase.
          </p>
        </div>
      </div>
    </footer>
  );
}
