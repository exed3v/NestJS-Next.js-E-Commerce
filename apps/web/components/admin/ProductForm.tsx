"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, ImagePlus } from "lucide-react";
import { AdminProduct, AdminVariant } from "@/types/admin";
import { categories } from "@/data/products";
import { Button } from "../ui/Button";

interface Props {
  product: AdminProduct | null;
  onSave: (product: AdminProduct) => void;
  onCancel: () => void;
}

const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["Blanco", "Negro", "Gris", "Azul", "Verde", "Marrón", "Rojo"];

const ProductForm = ({ product, onSave, onCancel }: Props) => {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? categories[0]);
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [variants, setVariants] = useState<AdminVariant[]>(
    product?.variants ?? [{ size: "M", color: "Negro", stock: 10 }],
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result)
          setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const updateVariant = (
    idx: number,
    field: keyof AdminVariant,
    value: string | number,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
    );
  };

  const addVariant = () =>
    setVariants((prev) => [...prev, { size: "M", color: "Negro", stock: 0 }]);
  const removeVariant = (idx: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onSave({
      id: product?.id ?? 0,
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      image: images[0] ?? product?.image ?? "",
      images,
      variants,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="pName">Nombre</Label>
        <Input
          id="pName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pDesc">Descripción</Label>
        <Textarea
          id="pDesc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pPrice">Precio (€)</Label>
          <Input
            id="pPrice"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Imágenes</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative h-20 w-20 overflow-hidden rounded-md border border-border"
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Variantes</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
            className="gap-1"
          >
            <Plus className="h-3 w-3" /> Añadir
          </Button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select
                value={v.size}
                onValueChange={(val) => updateVariant(i, "size", val)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={v.color}
                onValueChange={(val) => updateVariant(i, "color", val)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                className="w-20"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) =>
                  updateVariant(i, "stock", parseInt(e.target.value) || 0)
                }
              />
              {variants.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(i)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default ProductForm;
