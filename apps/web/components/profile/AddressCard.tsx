import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Address } from "@/types";
import { Button } from "../ui/Button";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{address.label}</span>
        {address.isDefault && (
          <Badge variant="secondary" className="text-xs">
            Principal
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{address.street}</p>
      <p className="text-sm text-muted-foreground">
        {address.city}, {address.zip}
      </p>
      <p className="text-sm text-muted-foreground">{address.country}</p>
    </div>

    <div className="flex gap-2 shrink-0">
      <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
        <Pencil className="h-3.5 w-3.5 mr-1.5" />
        Editar
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(address)}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
        Eliminar
      </Button>
    </div>
  </div>
);

export default AddressCard;
