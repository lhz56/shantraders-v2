import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shan Traders Catalogue",
  description: "Minimalist wholesale catalogue for Shan Traders Inc.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-[#f4f4f7] text-[#1e293b] antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
