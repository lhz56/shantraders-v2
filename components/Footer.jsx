"use client";

const email = "shantradersinc@gmail.com";
const phoneDisplay = "(347) 905-8484";
const phoneHref = "+13479058484";
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-sm text-slate-100 dark:border-slate-700/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Contact
          </p>
          <p className="text-sm">
            Email:{" "}
            <a
              href={`mailto:${email}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </p>
          <p className="text-sm">
            Phone:{" "}
            <a
              href={`tel:${phoneHref}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {phoneDisplay}
            </a>
          </p>
        </div>
        <div className="space-y-2 text-sm md:text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Shan Traders Inc.
          </p>
          <p>&copy; {year} Shan Traders Inc. All rights reserved.</p>
          <p className="text-xs text-red-300 md:text-sm">
            Note: All new customers must provide valid business registration
            information and a tax ID before purchase.
          </p>
        </div>
      </div>
    </footer>
  );
}
