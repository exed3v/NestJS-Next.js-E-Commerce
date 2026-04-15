"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ProductFilters from "@/components/products/ProductFilters";
import ProductCard from "@/components/products/ProductCard";
import { Category, Product } from "@/libs/types";
import { useDebounce } from "@/libs/hooks/useDebounce";

interface ProductsClientProps {
  initialProducts: {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  categories: Category[];
  availableSizes: string[];
  availableColors: string[];
}

export default function ProductsClient({
  initialProducts,
  categories,
  availableSizes,
  availableColors,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Valores actuales de la URL
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentMinPrice = Number(searchParams.get("minPrice")) || 0;
  const currentMaxPrice = Number(searchParams.get("maxPrice")) || 200;
  const currentSizes =
    searchParams.get("size")?.split(",").filter(Boolean) || [];
  const currentColors =
    searchParams.get("color")?.split(",").filter(Boolean) || [];
  const currentPage = Number(searchParams.get("page")) || 1;

  // Estado local para el input de búsqueda
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Actualizar URL cuando cambia el término debounced
  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`/products?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, currentSearch, router, searchParams]);

  // Actualizar URL con otros filtros
  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });

      if (!("page" in updates)) {
        params.delete("page");
      }

      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleCategoryChange = useCallback(
    (categorySlug: string) => {
      const selected = currentCategory ? currentCategory.split(",") : [];
      const newCategories = selected.includes(categorySlug)
        ? selected.filter((c) => c !== categorySlug)
        : [...selected, categorySlug];
      updateFilters({ category: newCategories.join(",") });
    },
    [currentCategory, updateFilters],
  );

  const handlePriceChange = useCallback(
    (range: [number, number]) => {
      updateFilters({ minPrice: range[0], maxPrice: range[1] });
    },
    [updateFilters],
  );

  const handleSizeChange = useCallback(
    (size: string) => {
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter((s) => s !== size)
        : [...currentSizes, size];
      updateFilters({ size: newSizes });
    },
    [currentSizes, updateFilters],
  );

  const handleColorChange = useCallback(
    (color: string) => {
      const newColors = currentColors.includes(color)
        ? currentColors.filter((c) => c !== color)
        : [...currentColors, color];
      updateFilters({ color: newColors });
    },
    [currentColors, updateFilters],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage });
    },
    [updateFilters],
  );

  const products = initialProducts.data;
  const totalPages = initialProducts.totalPages;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <X className="h-4 w-4" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" />
          )}
          Filtros
        </Button>
      </div>

      <div className="flex gap-8">
        <aside
          className={`w-64 shrink-0 ${showFilters ? "block" : "hidden"} md:block`}
        >
          <ProductFilters
            categories={categories}
            selectedCategorySlugs={
              currentCategory ? currentCategory.split(",") : []
            }
            onCategoryChange={handleCategoryChange}
            priceRange={[currentMinPrice, currentMaxPrice]}
            onPriceChange={handlePriceChange}
            availableSizes={availableSizes}
            selectedSizes={currentSizes}
            onSizeChange={handleSizeChange}
            availableColors={availableColors}
            selectedColors={currentColors}
            onColorChange={handleColorChange}
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
          />
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No se encontraron productos.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
