import React from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  BarChart3,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAccessButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

const QuickAccessButton = ({
  icon,
  label,
  onClick = () => {},
  variant = "default",
}: QuickAccessButtonProps) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center h-24 w-full gap-2 p-2",
        variant === "default" ? "bg-primary" : "bg-card",
      )}
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
};

interface QuickAccessProps {
  onNewTransaction?: () => void;
  onAddProduct?: () => void;
  onStockCheck?: () => void;
  onDailyReport?: () => void;
}

const QuickAccess = ({
  onNewTransaction = () => {},
  onAddProduct = () => {},
  onStockCheck = () => {},
  onDailyReport = () => {},
}: QuickAccessProps) => {
  return (
    <div className="w-full bg-background p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Akses Cepat</h2>
        <Button variant="ghost" size="sm" className="text-xs">
          <Plus className="h-4 w-4 mr-1" /> Tambah Pintasan
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAccessButton
          icon={<ShoppingCart />}
          label="Transaksi Baru"
          onClick={onNewTransaction}
        />

        <QuickAccessButton
          icon={<Package />}
          label="Tambah Produk"
          onClick={onAddProduct}
          variant="secondary"
        />

        <QuickAccessButton
          icon={<ClipboardList />}
          label="Stok Opname"
          onClick={onStockCheck}
          variant="secondary"
        />

        <QuickAccessButton
          icon={<BarChart3 />}
          label="Laporan Harian"
          onClick={onDailyReport}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default QuickAccess;
