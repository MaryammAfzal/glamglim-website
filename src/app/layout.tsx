import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Glam Glim | Premium Makeup, Perfumes & Hair Accessories",
  description:
    "Discover Glam Glim Planet: high-end makeup, luxury perfumes, and elegant hair accessories priced honestly. Experience fast delivery and Cash on Delivery (COD) across Pakistan.",
  keywords: "makeup, perfumes, hair accessories, beauty products, cosmetics pakistan, luxury fragrances, organic makeup, glam glim",
  authors: [{ name: "Glam Glim Team" }],
  openGraph: {
    title: "Glam Glim | Premium Makeup, Perfumes & Hair Accessories",
    description: "Quality cosmetics and luxury scents at honest prices. Shop Glam Glim Planet.",
    url: "https://glamglim.com",
    siteName: "Glam Glim",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}

