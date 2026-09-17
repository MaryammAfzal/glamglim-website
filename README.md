# Glam Glim — website (work in progress)

This is the start of the Glam Glim ecommerce site. Built with Next.js,
Tailwind CSS, and (soon) Supabase for the database.

## What's done so far

- Homepage: hero section, value props strip, featured products grid,
  brand story section, footer
- Reusable header/nav, footer, product card components
- The "arch" motif from your logo, turned into a reusable SVG component
  used as the site's signature visual element (hero, footer)
- Brand colors and fonts wired up to match your actual logo (wine
  maroon, soft lilac, magenta accent, Cormorant Garamond + Inter)

## What's NOT done yet

- Shop/catalog page, product detail pages, cart, checkout
- Supabase connection (products are currently hardcoded sample data
  in `src/lib/sample-data.ts`, just for layout purposes)
- Payment integration (JazzCash/card)
- Admin panel

## Running it locally

You'll need Node.js installed (v18 or newer).

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## A note on fonts

The fonts (Cormorant Garamond, Inter) load via a CSS `@import` from
Google Fonts in `src/app/globals.css`, so you'll need an internet
connection for them to display correctly — they're not bundled
locally. This is intentional for now; we can switch to self-hosted
font files later if you want to remove the external dependency.

## What to check when you preview it

- Does the arch motif in the hero feel "you" — should it be more or
  less prominent?
- Are the colors matching your brand the way you pictured?
- Hero copy: "Skincare and makeup, priced honestly" — does this
  match how you want to position the brand, or do you want a
  different angle?
- The "product photo" and "brand photo" boxes are placeholders —
  real photos will replace these once we have your product shots
  from the relaunch plan

## Next steps (once you give feedback)

1. Shop/catalog page with filtering by category
2. Product detail page with add-to-cart
3. Cart + checkout flow (COD + JazzCash/card)
4. Wire up Supabase (real product data, replacing the sample data)
5. Admin panel for managing products and orders
6. Deploy to Vercel (free) for a live preview link
