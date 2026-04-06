import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

interface DeleteAccountModalProps {
  onConfirm: () => void;
}

const DeleteAccountModal = ({ onConfirm }: DeleteAccountModalProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" className="gap-2">
        <Trash2 className="h-4 w-4" />
        Eliminar cuenta
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción es irreversible. Se eliminarán todos tus datos y serás
          redirigido al inicio.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Sí, eliminar cuenta
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteAccountModal;
