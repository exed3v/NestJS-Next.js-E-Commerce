"use client";

import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Product } from "@/libs/types";

interface HomePageProps {
  featuredProducts: Product[];
}

export default function HomePage({ featuredProducts }: HomePageProps) {
  console.log("productsss en HomePage", featuredProducts);
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts products={featuredProducts} />
      <TestimonialsSection />
    </main>
  );
}
