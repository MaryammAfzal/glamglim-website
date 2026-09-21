import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ShopProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Glam Glim | Premium Makeup, Perfumes & Hair Accessories",
  description:
    "Discover Glam Glim Planet: high-end makeup, luxury perfumes, and elegant hair accessories priced honestly. Experience fast delivery and Cash on Delivery (COD) across Pakistan.",
  keywords:
    "makeup, perfumes, hair accessories, beauty products, cosmetics pakistan, luxury fragrances, organic makeup, glam glim",
  authors: [{ name: "Glam Glim Team" }],
  openGraph: {
    title: "Glam Glim | Premium Makeup, Perfumes & Hair Accessories",
    description:
      "Quality cosmetics and luxury scents at honest prices. Shop Glam Glim Planet.",
    url: "https://glamglim.pk",
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

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1233368773203333');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1233368773203333&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}