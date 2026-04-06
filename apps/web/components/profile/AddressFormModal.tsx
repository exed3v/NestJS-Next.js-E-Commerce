"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/types";
import { Button } from "../ui/Button";

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, "id"> & { id?: string }) => void;
  address?: Address | null;
}

const AddressFormModal = ({
  open,
  onClose,
  onSave,
  address,
}: AddressFormModalProps) => {
  // Estado inicial basado en address (sin useEffect)
  const [form, setForm] = useState(() => {
    if (!address) {
      return {
        label: "",
        street: "",
        city: "",
        zip: "",
        country: "España",
        isDefault: false,
      };
    }
    return {
      label: address.label,
      street: address.street,
      city: address.city,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.label.trim()) e.label = "Requerido";
    if (!form.street.trim()) e.street = "Requerido";
    if (!form.city.trim()) e.city = "Requerido";
    if (!form.zip.trim()) e.zip = "Requerido";
    if (!form.country.trim()) e.country = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, id: address?.id });
    onClose();
  };

  const fields: {
    key: keyof typeof form;
    label: string;
    placeholder: string;
  }[] = [
    { key: "label", label: "Nombre", placeholder: "Ej: Casa, Trabajo" },
    { key: "street", label: "Calle", placeholder: "Calle y número" },
    { key: "city", label: "Ciudad", placeholder: "Ciudad" },
    { key: "zip", label: "Código postal", placeholder: "00000" },
    { key: "country", label: "País", placeholder: "País" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {address ? "Editar dirección" : "Nueva dirección"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                placeholder={f.placeholder}
                value={form[f.key] as string}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
              />
              {errors[f.key] && (
                <p className="text-xs text-destructive">{errors[f.key]}</p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, isDefault: !!v }))
              }
            />
            <Label
              htmlFor="isDefault"
              className="text-sm font-normal cursor-pointer"
            >
              Establecer como principal
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormModal;
