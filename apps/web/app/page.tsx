import { productsApi } from "@/libs/api/products";
import HomePage from "@/components/home/Home";
import { categoriesApi } from "@/libs/api/categories";

export default async function Page() {
  const [featuredProducts, categories] = await Promise.all([
    productsApi.getAll({ isFeatured: true }),
    categoriesApi.getAll(),
  ]);
  return (
    <HomePage
      featuredProducts={featuredProducts.data}
      categories={categories}
    />
  );
}
