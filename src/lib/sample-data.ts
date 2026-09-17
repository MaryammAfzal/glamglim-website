export type ProductVariant = {
  id: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice: number;
  inventory: number;
  image?: string;
};

export type Product = {
  id: string;

  name: string;

  category: "makeup" | "perfumes" | "hair_acc";

  subcategory?: string;

  price: number;

  compareAtPrice?: number;

  shortDescription: string;

  description: string;

  ingredients?: string;

  howToUse?: string;

  image: string;

  badge?: string;

  rating: number;

  reviewsCount: number;

  inventory: number;

  isPublished: boolean;

  // Dynamic product variants
  variants?: ProductVariant[];
};

// Preset catalog of products - acts as seed data for localStorage store.
export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Matte Velvet Lipstick",
    category: "makeup",
    price: 850,
    compareAtPrice: 1100,
    shortDescription:
      "Long-wear, transfer-resistant, in our signature crimson shade.",
    description:
      "A weightless, modern matte lipstick that delivers high-pigment color with a velvety, moisturizing finish. Enriched with vitamin E and jojoba oil to keep lips soft all day without drying or feathering.",
    ingredients:
      "Octyldodecanol, Ricinus Communis (Castor) Seed Oil, Silica, Tricaprylyl Citrate, Ozonized Jojoba Oil, Synthetic Wax, Copernicia Cerifera (Carnauba) Wax, Tocopheryl Acetate (Vitamin E), Fragrance (Parfum).",
    howToUse:
      "Apply directly to lips from the bullet or use a lip brush for precise definition. Layer for a more intense, dramatic color payoff.",
    image: "/lipstick_matte.png",
    badge: "Bestseller",
    rating: 4.8,
    reviewsCount: 124,
    inventory: 50,
    isPublished: true,
  },

  {
    id: "2",
    name: "Dewy Finish Foundation",
    category: "makeup",
    price: 1450,
    compareAtPrice: 1850,
    shortDescription:
      "Buildable medium coverage with a natural, healthy glow.",
    description:
      "A breathable, skin-first foundation that hydrates and evens skin tone. The light-reflective formula mimics your skin's natural texture, providing a glowing finish that lasts up to 12 hours.",
    ingredients:
      "Water (Aqua), Glycerin, Dimethicone, Coco-Caprylate, Butylene Glycol, Squalane, Niacinamide, Sodium Hyaluronate, Centella Asiatica Extract, Phenoxyethanol, Iron Oxides.",
    howToUse:
      "Shake well before use. Dispense 1-2 pumps onto the back of your hand. Blend outward from the center of your face using a damp beauty sponge, foundation brush, or clean fingertips.",
    image: "/foundation_glow.png",
    badge: "Trending",
    rating: 4.6,
    reviewsCount: 89,
    inventory: 35,
    isPublished: true,
  },

  {
    id: "3",
    name: "Rose d'Amour Eau de Parfum",
    category: "perfumes",
    price: 3850,
    compareAtPrice: 4500,
    shortDescription:
      "A romantic bouquet of Damask rose, warm amber, and fresh pear.",
    description:
      "An intoxicating, modern floral fragrance that captures the essence of romance. Opening with fresh notes of green pear and pink pepper, it transitions to a heart of rich Damask rose, settling on a warm base of amber and vanilla.",
    ingredients:
      "Alcohol Denat., Fragrance (Parfum), Water (Aqua), Benzyl Salicylate, Limonene, Linalool, Citronellol, Geraniol, Coumarin.",
    howToUse:
      "Spray on pulse points such as wrists, neck, and behind the ears. Do not rub the perfume into your skin, as this can break down the fragrance notes and cause it to fade faster.",
    image: "/perfume_rose.png",
    badge: "New Release",
    rating: 4.9,
    reviewsCount: 56,
    inventory: 20,
    isPublished: true,
  },

  {
    id: "4",
    name: "Tortoiseshell Hair Claw",
    category: "hair_acc",
    price: 750,
    shortDescription:
      "Premium hand-polished claw clip for effortless, everyday styling.",
    description:
      "An elegant hair claw crafted from durable, eco-friendly cellulose acetate. Designed with double-action teeth to hold all hair types securely in place without pulling, snagging, or causing headaches.",
    ingredients:
      "100% Cellulose Acetate (Eco-friendly plastic alternative), steel alloy spring.",
    howToUse:
      "Gather your hair into a twist, lift it upwards, and secure it with the claw clip. Perfect for half-up styles, low buns, or full French twists.",
    image: "/hair_claw_teaser.png",
    badge: "Coming Soon",
    rating: 4.7,
    reviewsCount: 18,
    inventory: 0,
    isPublished: false,
  },
];