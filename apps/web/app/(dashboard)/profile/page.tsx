"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { mockOrders } from "@/data/orders";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileData from "@/components/profile/ProfileData";
import ProfileOrders from "@/components/profile/ProfileOrders";
import ProfileAddresses from "@/components/profile/ProfileAddresses";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";

type Tab = "datos" | "ordenes" | "direcciones";

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("datos");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const profileUser: User = {
    ...user,
    phone: user.phone || "+34 123 456 789",
    memberSince: user.memberSince || "Enero 2025",
  };

  const handleSave = (data: { name: string; email: string; phone: string }) => {
    login(data.email, data.name);
    const stored = JSON.parse(localStorage.getItem("auth-user") || "{}");
    localStorage.setItem(
      "auth-user",
      JSON.stringify({
        ...stored,
        ...data,
        memberSince: profileUser.memberSince,
      }),
    );
  };

  const handleDelete = () => {
    logout();
    toast.success("Cuenta eliminada correctamente");
    router.push("/");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "datos":
        return (
          <ProfileData
            user={profileUser}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case "ordenes":
        return <ProfileOrders orders={mockOrders} />;
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
          user={profileUser}
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
