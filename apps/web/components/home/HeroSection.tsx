"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Define tu estilo
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Prendas minimalistas de alta calidad diseñadas para el día a día.
        </p>
        <Link href="/products">
          <Button size="lg" className="mt-6 gap-2">
            Ver productos <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
