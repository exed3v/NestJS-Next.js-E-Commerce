import { Address } from "@/types";

export const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Casa",
    street: "Calle Principal 123",
    city: "Madrid",
    zip: "28001",
    country: "España",
    isDefault: true,
  },
  {
    id: "2",
    label: "Trabajo",
    street: "Avenida Empresarial 456",
    city: "Madrid",
    zip: "28002",
    country: "España",
    isDefault: false,
  },
];
