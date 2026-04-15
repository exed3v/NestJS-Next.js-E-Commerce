import { productsApi } from "@/libs/api/products";
import { categoriesApi } from "@/libs/api/categories";
import ProductsClient from "./ProductsClient";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  // 1. Obtener todas las categorías (para el menú de filtros)
  const categories = await categoriesApi.getAll();

  // 2. Mapear slugs de categoría a IDs
  const categorySlugs = params.category?.split(",") || [];
  const categoryIds: string[] = [];

  for (const slug of categorySlugs) {
    try {
      const category = await categoriesApi.getBySlug(slug);
      categoryIds.push(category.id);
    } catch (error) {
      console.warn(`Categoría con slug "${slug}" no encontrada`);
    }
  }

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const page = params.page ? Number(params.page) : 1;
  const limit = params.limit ? Number(params.limit) : 6;

  // 3. Obtener productos paginados con filtros
  const productsData = await productsApi.getAll({
    categoryIds,
    search: params.search,
    minPrice,
    maxPrice,
    page,
    limit,
  });

  // 4. Extraer tallas y colores únicos de los productos obtenidos
  const availableSizes = Array.from(
    new Set(
      productsData.data.flatMap((p) =>
        p.variants.filter((v) => v.type === "size").map((v) => v.value),
      ),
    ),
  ).sort();

  const availableColors = Array.from(
    new Set(
      productsData.data.flatMap((p) =>
        p.variants.filter((v) => v.type === "color").map((v) => v.value),
      ),
    ),
  ).sort();

  return (
    <ProductsClient
      initialProducts={productsData}
      categories={categories}
      availableSizes={availableSizes}
      availableColors={availableColors}
    />
  );
}
