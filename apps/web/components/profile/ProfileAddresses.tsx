"use client";

import { useState } from "react";
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
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";
import { Button } from "../ui/Button";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/libs/hooks/useAddresses";
import { Address, AddressInput } from "@/libs/types";

const ProfileAddresses = () => {
  const { data: addresses = [], isLoading, error } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);

  const handleCreate = async (data: AddressInput) => {
    try {
      await createAddress.mutateAsync(data);
      toast.success("Dirección agregada");
      setFormOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      toast.error(message);
    }
  };

  // ✅ Función separada para ACTUALIZAR
  const handleUpdate = async (data: AddressInput & { id: string }) => {
    try {
      await updateAddress.mutateAsync({ id: data.id, data });
      toast.success("Dirección actualizada");
      setFormOpen(false);
      setEditing(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      toast.error(message);
    }
  };

  // ✅ Función que decide cuál llamar
  const handleSave = (data: AddressInput & { id?: string }) => {
    if (data.id) {
      handleUpdate(data as AddressInput & { id: string });
    } else {
      handleCreate(data);
      console.log("se ejecuta el create en handleSave");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteAddress.mutateAsync(deleting.id);
      toast.success("Dirección eliminada");
      setDeleting(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Cargando direcciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-destructive mb-2">Error al cargar las direcciones</p>
        <p className="text-sm text-muted-foreground">
          Intenta recargar la página
        </p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
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
        </div>
        <AddressFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          isSubmitting={createAddress.isPending || updateAddress.isPending}
        />
      </>
    );
  }

  return (
    <>
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
      </div>

      <AddressFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        address={editing}
        isSubmitting={createAddress.isPending || updateAddress.isPending}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la dirección. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteAddress.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAddress.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileAddresses;
