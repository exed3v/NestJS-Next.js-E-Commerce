"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/Button";
import { Address, AddressInput } from "@/libs/types";

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: AddressInput & { id?: string }) => void;
  address?: Address | null;
  isSubmitting?: boolean;
}

const AddressFormModal = ({
  open,
  onClose,
  onSave,
  address,
  isSubmitting = false,
}: AddressFormModalProps) => {
  const [form, setForm] = useState<AddressInput & { id?: string }>({
    firstName: "",
    lastName: "",
    company: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "España",
    phone: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (address) {
        setForm({
          firstName: address.firstName || "",
          lastName: address.lastName || "",
          company: address.company || "",
          addressLine1: address.addressLine1 || "",
          addressLine2: address.addressLine2 || "",
          city: address.city || "",
          state: address.state || "",
          postalCode: address.postalCode || "",
          country: address.country || "España",
          phone: address.phone || "",
          isDefault: address.isDefault || false,
          id: address.id,
        });
      } else {
        setForm({
          firstName: "",
          lastName: "",
          company: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "España",
          phone: "",
          isDefault: false,
        });
      }
      setErrors({});
    }
  }, [address, open]); //

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Requerido";
    if (!form.lastName.trim()) e.lastName = "Requerido";
    if (!form.addressLine1.trim()) e.addressLine1 = "Requerido";
    if (!form.city.trim()) e.city = "Requerido";
    if (!form.state.trim()) e.state = "Requerido";
    if (!form.postalCode.trim()) e.postalCode = "Requerido";
    if (!form.country.trim()) e.country = "Requerido";
    if (!form.phone.trim()) e.phone = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const dataToSave = {
      ...form,
      id: address?.id,
    };
    onSave(dataToSave);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {address ? "Editar dirección" : "Nueva dirección"}
          </DialogTitle>
          <DialogDescription>
            {address
              ? "Modifica los datos de tu dirección."
              : "Completa los datos para agregar una nueva dirección."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                placeholder="Juan"
                value={form.firstName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                placeholder="Pérez"
                value={form.lastName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Empresa (opcional)</Label>
            <Input
              id="company"
              placeholder="Empresa S.L."
              value={form.company}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine1">Dirección *</Label>
            <Input
              id="addressLine1"
              placeholder="Calle y número"
              value={form.addressLine1}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, addressLine1: e.target.value }))
              }
            />
            {errors.addressLine1 && (
              <p className="text-xs text-destructive">{errors.addressLine1}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine2">Dirección 2 (opcional)</Label>
            <Input
              id="addressLine2"
              placeholder="Piso, puerta, etc."
              value={form.addressLine2}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, addressLine2: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="Madrid"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">Provincia *</Label>
              <Input
                id="state"
                placeholder="Madrid"
                value={form.state}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, state: e.target.value }))
                }
              />
              {errors.state && (
                <p className="text-xs text-destructive">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Código postal *</Label>
              <Input
                id="postalCode"
                placeholder="28001"
                value={form.postalCode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, postalCode: e.target.value }))
                }
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive">{errors.postalCode}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                placeholder="España"
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
              />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              placeholder="+34 600 000 000"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

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
              Establecer como dirección principal
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormModal;
