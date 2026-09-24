import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ShopProvider } from "@/lib/store";
import { MessageCircle } from "lucide-react";

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

        {/* ============================================
            FLOATING WHATSAPP BUTTON
            ============================================ */}

      <a
  href="https://wa.me/923254715421"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Glam Glim on WhatsApp"
  className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-8 h-8"
    fill="currentColor"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.768.46 3.43 1.265 4.88L2 22l5.27-1.383A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.17 8.17 0 0 1-4.166-1.14l-.3-.178-3.128.82.835-3.046-.195-.313A8.17 8.17 0 1 1 12 20.2zm4.48-6.13c-.245-.123-1.45-.715-1.675-.797-.224-.082-.388-.123-.552.123-.163.245-.633.797-.776.96-.143.164-.286.184-.531.062-.245-.123-1.035-.381-1.971-1.216-.728-.65-1.219-1.451-1.362-1.696-.143-.245-.015-.378.108-.5.111-.11.245-.286.367-.429.123-.143.164-.245.245-.408.082-.164.041-.306-.02-.429-.061-.123-.552-1.329-.756-1.82-.2-.477-.404-.413-.552-.42l-.47-.008c-.163 0-.429.061-.653.306-.224.245-.858.838-.858 2.043 0 1.205.878 2.37 1 2.534.123.163 1.728 2.638 4.187 3.699.585.252 1.04.403 1.395.516.586.187 1.12.161 1.543.098.47-.07 1.45-.593 1.654-1.165.204-.572.204-1.062.143-1.165-.061-.102-.225-.163-.47-.286z" />
  </svg>
</a>

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