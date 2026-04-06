import { User as UserIcon, ShoppingBag, MapPin, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types";
import { cn } from "@/libs/utils/utils";
import { Button } from "../ui/Button";
type Tab = "datos" | "ordenes" | "direcciones";

interface ProfileSidebarProps {
  user: User;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const ProfileSidebar = ({
  user,
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) => {
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "datos", label: "Mis datos", icon: <UserIcon className="h-4 w-4" /> },
    {
      id: "ordenes",
      label: "Mis órdenes",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: "direcciones",
      label: "Mis direcciones",
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-72 flex-col rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Avatar className="h-20 w-20 text-xl">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Separator className="mb-4" />

        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <Separator className="my-4" />

        <Button
          variant="ghost"
          className="justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </aside>

      {/* Mobile tabs */}
      <div className="flex md:hidden gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default ProfileSidebar;
