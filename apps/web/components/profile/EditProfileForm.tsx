import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { toast } from "sonner";
import { Button } from "../ui/Button";

interface EditProfileFormProps {
  user: User;
  onSave: (data: { name: string; email: string; phone: string }) => void;
}

const EditProfileForm = ({ user, onSave }: EditProfileFormProps) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "El nombre no puede estar vacío";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Email no válido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    setEditing(false);
    toast.success("Perfil actualizado correctamente");
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || "");
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
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
            placeholder="+34 000 000 000"
          />
        </div>
        <div className="space-y-2">
          <Label>Miembro desde</Label>
          <Input
            value={user.memberSince || "Enero 2025"}
            disabled
            className="text-muted-foreground"
          />
        </div>
      </div>

      {editing && (
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}>Guardar cambios</Button>
          <Button variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditProfileForm;
