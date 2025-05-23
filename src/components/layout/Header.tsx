import React from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  Settings,
  User,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("User");
  const [companyName, setCompanyName] = useState("KasirSmart");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.email?.split("@")[0] || "User");
      setUserRole(userProfile.role || "User");
      setCompanyName(userProfile.company?.name || "KasirSmart");
    } else if (user?.email) {
      setUserName(user.email.split("@")[0]);
    }
  }, [userProfile, user]);

  const handleSignOut = async () => {
    try {
      // Disable any UI interactions during logout
      setLoading(true);

      const success = await signOut();

      if (success) {
        // Immediate redirect to login page after successful logout
        window.location.href = "/login";
      } else {
        console.error("Logout was not successful");
        setLoading(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "Dashboard";
      case "/pos":
        return "Kasir (POS)";
      case "/penjualan":
        return "Penjualan";
      case "/inventaris":
        return "Inventaris";
      case "/gudang":
        return "Gudang";
      case "/toko":
        return "Toko";
      case "/laporan":
        return "Laporan";
      case "/pengguna":
        return "Pengguna";
      case "/pengaturan":
        return "Pengaturan";
      case "/profile":
        return "Profil";
      default:
        return "KasirSmart";
    }
  };

  return (
    <header
      className={`bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10 ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">{getPageTitle()}</h1>
        <p className="text-sm text-gray-500">
          {companyName} - Sistem Manajemen Kasir UMKM
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 h-auto p-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-primary text-white">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = "/profile")}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (window.location.href = "/pengaturan")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600"
              disabled={loading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{loading ? "Keluar..." : "Keluar"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
