import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { User } from "@/libs/types";

interface EditProfileFormProps {
  user: User;
  onSave: (data: { fullName: string; email: string }) => void;
}

const EditProfileForm = ({ user, onSave }: EditProfileFormProps) => {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "El nombre no puede estar vacío";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Email no válido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        email: email.trim(),
      });
      setEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFullName(user.fullName || "");
    setEmail(user.email);
    setErrors({});
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Mis datos</h2>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Editar
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!editing || isSubmitting}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing || isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditProfileForm;
