import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Warehouse,
  Store,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const Sidebar = ({
  userName: propUserName,
  userRole: propUserRole,
  userAvatar = "",
}: SidebarProps) => {
  const { user, userProfile, signOut } = useAuth();
  const [userName, setUserName] = useState(propUserName || "User");
  const [userRole, setUserRole] = useState(propUserRole || "User");
  const [companyName, setCompanyName] = useState("Company");

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.email.split("@")[0] || "User");
      setUserRole(userProfile.role || "User");
      setCompanyName(userProfile.company?.name || "Company");
    } else if (user?.email) {
      setUserName(user.email.split("@")[0]);
    }
  }, [userProfile, user, propUserName, propUserRole]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to login page after successful logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // You could show a toast notification here
    }
  };
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="mr-2 h-5 w-5" />,
      path: "/",
    },
    {
      title: "Kasir (POS)",
      icon: <ShoppingCart className="mr-2 h-5 w-5" />,
      path: "/pos",
    },
    {
      title: "Penjualan",
      icon: <ShoppingCart className="mr-2 h-5 w-5" />,
      path: "/penjualan",
    },
    {
      title: "Inventaris",
      icon: <Package className="mr-2 h-5 w-5" />,
      path: "/inventaris",
    },
    {
      title: "Gudang",
      icon: <Warehouse className="mr-2 h-5 w-5" />,
      path: "/gudang",
    },
    {
      title: "Toko",
      icon: <Store className="mr-2 h-5 w-5" />,
      path: "/toko",
    },
    {
      title: "Laporan",
      icon: <BarChart3 className="mr-2 h-5 w-5" />,
      path: "/laporan",
    },
    {
      title: "Pengguna",
      icon: <Users className="mr-2 h-5 w-5" />,
      path: "/pengguna",
    },
    {
      title: "Pengaturan",
      icon: <Settings className="mr-2 h-5 w-5" />,
      path: "/pengaturan",
    },
  ];

  return (
    <div className="flex h-full w-[280px] flex-col bg-white shadow-md">
      <div className="flex items-center gap-2 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
          <span className="text-xl font-bold">
            {companyName.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-lg font-bold">{companyName}</h1>
          <p className="text-xs text-muted-foreground">KasirSmart UMKM</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary text-white hover:bg-primary/90"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 KasirSmart UMKM
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
