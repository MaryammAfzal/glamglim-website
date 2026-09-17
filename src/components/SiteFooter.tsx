import Link from "next/link";
import { ArchMotif } from "./ArchMotif";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8h-2a2 2 0 0 0-2 2v2H10v3h2v6h3v-6h2.2l0.8-3H15v-1.5c0-.5.3-1 1-1h2V8Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-32 bg-wine text-cream overflow-hidden">
      <ArchMotif
        className="absolute -top-10 right-[-60px] w-[260px] h-[340px] opacity-[0.08] pointer-events-none"
        strokeColor="#FAF7F8"
        strokeWidth={1}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-12">
          <div>
            <p className="font-display text-[26px] mb-2">Glam Glim</p>
            <p className="text-[13px] uppercase tracking-eyebrow text-cream/60 mb-4">
              Planet
            </p>
            <p className="text-[14px] text-cream/75 leading-relaxed max-w-xs">
              Quality skincare and makeup, priced honestly. No middlemen
              markup, just the products that work.
            </p>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-eyebrow text-cream/60 mb-4">
              Shop
            </p>
            <ul className="flex flex-col gap-3 text-[14px] text-cream/85">
              <li>
                <Link href="/shop" className="hover:text-magenta transition-colors">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=skincare" className="hover:text-magenta transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/shop?category=makeup" className="hover:text-magenta transition-colors">
                  Makeup
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-eyebrow text-cream/60 mb-4">
              Get in touch
            </p>
            <p className="text-[14px] text-cream/85 mb-4">
              Order on Instagram or browse the full catalog here.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/glamglim._/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-magenta transition-colors"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-magenta transition-colors"
              >
                {/* <FacebookIcon size={20} /> */}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/15 text-[12px] text-cream/55">
          © {new Date().getFullYear()} Glam Glim Planet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
