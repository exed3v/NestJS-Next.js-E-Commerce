"use client";

import Link from "next/link";
import { categories } from "@/data/products";

const categoryImages: Record<string, string> = {
  Camisetas:
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop",
  Pantalones:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop",
  Chaquetas:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
  Zapatos:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
};

const CategoriesSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-center text-2xl font-bold tracking-tight">
        Categorías populares
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${encodeURIComponent(cat)}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border transition-colors group-hover:border-foreground">
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {cat}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
