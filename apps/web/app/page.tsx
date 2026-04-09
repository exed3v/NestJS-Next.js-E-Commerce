import { productsApi } from "@/libs/api/products";
import HomePage from "@/components/home/Home";

export default async function Page() {
  const featuredProducts = await productsApi.getAll({ isFeatured: true });

  return <HomePage featuredProducts={featuredProducts} />;
}
