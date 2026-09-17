import type { Metadata } from "next";
import { sampleProducts } from "@/lib/sample-data";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = sampleProducts.find((p) => p.id === id);

  if (!product) {
    return {
      title: " Glam Glim Planet",
      description: "This beauty item could not be found.",
    };
  }

  return {
    title: `${product.name} | Glam Glim Planet`,
    description: `${product.shortDescription} Buy original Glam Glim cosmetics online in Pakistan.`,
    openGraph: {
      title: `${product.name} | Glam Glim Planet`,
      description: product.shortDescription,
      type: "website",
      images: [
        {
          url: product.image,
          width: 600,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}
