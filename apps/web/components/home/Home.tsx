"use client";

import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Category, Product } from "@/libs/types";

interface HomePageProps {
  featuredProducts: Product[];
  categories: Category[];
}

export default function HomePage({
  featuredProducts,
  categories,
}: HomePageProps) {
  return (
    <main>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <TestimonialsSection />
    </main>
  );
}
