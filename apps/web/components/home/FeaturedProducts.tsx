"use client";

import { products } from "@/data/products";
import ProductCard from "../products/ProductCard";

const FeaturedProducts = () => {
  const featured = products.slice(0, 4);

  return (
    <section className="container mx-auto px-4 pb-16">
      <h2 className="text-center text-2xl font-bold tracking-tight">
        Productos destacados
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
