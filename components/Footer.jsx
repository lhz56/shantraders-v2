"use client";

const email = "shantradersinc@gmail.com";
const phonePrimaryDisplay = "(347) 905-8484";
const phonePrimaryHref = "+13479058484";
const phoneSecondaryDisplay = "(631) 635-0786";
const phoneSecondaryHref = "+16316350786";
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-[#f4f4f7] py-8 text-sm text-[#64748b]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Contact
          </p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${email}`}
              className="font-medium text-gray-800 underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </p>
          <p>
            Phone:{" "}
            <a
              href={`tel:${phonePrimaryHref}`}
              className="font-medium text-gray-800 underline-offset-4 hover:underline"
            >
              {phonePrimaryDisplay}
            </a>
          </p>
          <p>
            Phone 2:{" "}
            <a
              href={`tel:${phoneSecondaryHref}`}
              className="font-medium text-gray-800 underline-offset-4 hover:underline"
            >
              {phoneSecondaryDisplay}
            </a>
          </p>
        </div>
        <div className="space-y-2 text-sm md:text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-400">
            Shan Traders Inc.
          </p>
          <p>&copy; {year} Shan Traders Inc. All rights reserved.</p>
          <p className="text-xs text-gray-500 md:text-sm">
            Note: All new customers must provide valid business registration
            information and a tax ID before purchase.
          </p>
        </div>
      </div>
    </footer>
  );
}
