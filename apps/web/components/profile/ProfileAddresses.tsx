"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Address } from "@/types";
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";
import { mockAddresses } from "@/data/addresses";
import { Button } from "../ui/Button";

const STORAGE_KEY = "clothing-store-addresses";

const loadAddresses = (): Address[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockAddresses;
  } catch {
    return mockAddresses;
  }
};

const ProfileAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const handleSave = (data: Omit<Address, "id"> & { id?: string }) => {
    setAddresses((prev) => {
      let list: Address[];
      if (data.id) {
        list = prev.map((a) =>
          a.id === data.id ? { ...a, ...data, id: a.id } : a,
        );
      } else {
        list = [...prev, { ...data, id: crypto.randomUUID() } as Address];
      }
      if (data.isDefault) {
        list = list.map((a) => ({
          ...a,
          isDefault: a.id === (data.id || list[list.length - 1].id),
        }));
      }
      return list;
    });
    toast.success(data.id ? "Dirección actualizada" : "Dirección agregada");
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setAddresses((prev) => prev.filter((a) => a.id !== deleting.id));
    toast.success("Dirección eliminada");
    setDeleting(null);
  };

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MapPin className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-1">
          No tienes direcciones guardadas
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Agrega una dirección para agilizar tus compras.
        </p>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar dirección
        </Button>
        <AddressFormModal
          key="new"
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Mis direcciones
        </h2>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onEdit={(a) => {
              setEditing(a);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
          />
        ))}
      </div>

      <AddressFormModal
        key={editing?.id || "new"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        address={editing}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la dirección "{deleting?.label}". Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileAddresses;
