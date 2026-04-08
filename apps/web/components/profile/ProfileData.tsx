import { Separator } from "@/components/ui/separator";
import EditProfileForm from "./EditProfileForm";
import DeleteAccountModal from "./DeleteAccountModal";
import { User } from "@/libs/types";

interface ProfileDataProps {
  user: User;
  onSave: (data: { fullName: string; email: string }) => void;
  onDelete: () => void;
}

const ProfileData = ({ user, onSave, onDelete }: ProfileDataProps) => (
  <div className="space-y-8">
    <EditProfileForm user={user} onSave={onSave} />
    <Separator />
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Zona de peligro</h3>
      <p className="text-sm text-muted-foreground">
        Una vez eliminada tu cuenta, no podrás recuperarla.
      </p>
      <DeleteAccountModal onConfirm={onDelete} />
    </div>
    <p className="text-xs text-muted-foreground/40 border-t border-border/30 pt-3">
      Miembro desde:{" "}
      {user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A"}
    </p>
  </div>
);

export default ProfileData;
