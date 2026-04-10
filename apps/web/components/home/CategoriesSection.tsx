"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/libs/types";

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  // Tomar solo las primeras 4 categorías principales (sin padre)
  const mainCategories = categories.filter((c) => !c.parentId).slice(0, 4);

  if (!mainCategories.length) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-center text-2xl font-bold tracking-tight">
        Categorías populares
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {mainCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border transition-colors group-hover:border-foreground">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground">
                    {cat.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
