"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileData from "@/components/profile/ProfileData";
import ProfileOrders from "@/components/profile/ProfileOrders";
import ProfileAddresses from "@/components/profile/ProfileAddresses";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { mockOrders } from "@/data/orders"; // Temporal hasta conectar órdenes
import { useDeleteMe, useUpdateMe } from "@/libs/hooks/useUsers";

type Tab = "datos" | "ordenes" | "direcciones";

const ProfilePage = () => {
  const { user, logout, isLoading } = useAuth();
  const updateMe = useUpdateMe();
  const deleteMe = useDeleteMe();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("datos");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10 md:py-16">
        <p className="text-center text-muted-foreground">Cargando perfil...</p>
      </section>
    );
  }

  if (!user) return null;

  const handleSave = async (data: { fullName: string; email: string }) => {
    try {
      await updateMe.mutateAsync(data);
      toast.success("Perfil actualizado correctamente");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMe.mutateAsync();
      toast.success("Cuenta eliminada correctamente");
      await logout();
      router.push("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar la cuenta";
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "datos":
        return (
          <ProfileData
            user={user}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case "ordenes":
        return <ProfileOrders />;
      case "direcciones":
        return <ProfileAddresses />;
    }
  };

  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <h1 className="text-2xl font-bold text-foreground mb-8 md:hidden">
        Mi perfil
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="flex-1 rounded-xl border border-border bg-card p-6 md:p-8 transition-all">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
