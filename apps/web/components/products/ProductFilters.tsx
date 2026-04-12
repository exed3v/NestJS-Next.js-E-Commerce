"use client";

import { useState } from "react";
import { Category } from "@/libs/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategorySlugs: string[];
  onCategoryChange: (slug: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  availableSizes: string[];
  selectedSizes: string[];
  onSizeChange: (size: string) => void;
  availableColors: string[];
  selectedColors: string[];
  onColorChange: (color: string) => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
}

// Componente recursivo para categorías anidadas
const CategoryItem = ({
  category,
  selectedSlugs,
  onToggle,
  depth = 0,
}: {
  category: Category;
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 hover:bg-muted rounded"
            aria-label={isOpen ? "Colapsar" : "Expandir"}
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        )}
        <Checkbox
          id={`cat-${category.id}`}
          checked={selectedSlugs.includes(category.slug)}
          onCheckedChange={() => onToggle(category.slug)}
        />
        <Label
          htmlFor={`cat-${category.id}`}
          className="text-sm text-muted-foreground cursor-pointer"
        >
          {category.name}
        </Label>
      </div>
      {hasChildren && isOpen && (
        <div className="ml-6 space-y-1 border-l border-border/50 pl-3">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedSlugs={selectedSlugs}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductFilters = ({
  categories,
  selectedCategorySlugs,
  onCategoryChange,
  priceRange,
  onPriceChange,
  availableSizes,
  selectedSizes,
  onSizeChange,
  availableColors,
  selectedColors,
  onColorChange,
  searchInput,
  onSearchInputChange,
}: ProductFiltersProps) => {
  // Filtrar solo categorías raíz (sin parentId)
  const rootCategories = categories.filter((cat) => !cat.parentId);

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          Buscar
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nombre del producto..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categorías con acordeón */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          Categoría
        </h3>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {rootCategories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              selectedSlugs={selectedCategorySlugs}
              onToggle={onCategoryChange}
            />
          ))}
        </div>
      </div>

      {/* Precio */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          Precio
        </h3>
        <Slider
          min={0}
          max={200}
          step={5}
          value={priceRange}
          onValueChange={(v) => onPriceChange(v as [number, number])}
          className="mt-2"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Tallas */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Talla
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedSizes.includes(size)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colores */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedColors.includes(color)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
