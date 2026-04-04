"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Laura Méndez",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    review:
      "La calidad de las prendas es increíble. El corte y los acabados son perfectos. Definitivamente mi tienda favorita.",
  },
  {
    name: "Carlos Ruiz",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    review:
      "Envío rápido y el producto llegó tal como se veía en las fotos. La chaqueta de cuero es espectacular.",
  },
  {
    name: "María García",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    review:
      "Me encanta el diseño minimalista de la tienda y las prendas. Todo combina perfectamente entre sí.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="border-t border-border bg-card py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Lo que dicen nuestros clientes
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-border bg-background p-6"
            >
              <div className="flex gap-1 text-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.review}</p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
