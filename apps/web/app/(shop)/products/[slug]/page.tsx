import { notFound } from "next/navigation";
import { productsApi } from "@/libs/api/products";
import ProductDetail from "./ProductDetail";

interface ProductDetailPageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  let product;

  try {
    product = await productsApi.getBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
