import { categories } from "@/data/products";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ProductFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedSizes: string[];
  onSizeChange: (size: string) => void;
}

const sizes = ["S", "M", "L", "XL"];

const ProductFilters = ({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedSizes,
  onSizeChange,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Categoría</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => onCategoryChange(cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm text-muted-foreground cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Precio</h3>
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

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Talla</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
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
    </div>
  );
};

export default ProductFilters;