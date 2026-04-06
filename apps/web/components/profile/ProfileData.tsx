import { User } from "@/types";
import { Separator } from "@/components/ui/separator";
import EditProfileForm from "./EditProfileForm";
import DeleteAccountModal from "./DeleteAccountModal";

interface ProfileDataProps {
  user: User;
  onSave: (data: { name: string; email: string; phone: string }) => void;
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
  </div>
);

export default ProfileData;
