import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  trend: "up" | "down" | "stable";
  percentage: number;
}

interface TopProductsProps {
  products?: Product[];
  title?: string;
  period?: string;
}

const TopProducts = ({
  products = [
    {
      id: "1",
      name: "Kopi Susu",
      category: "Minuman",
      sales: 120,
      trend: "up",
      percentage: 15,
    },
    {
      id: "2",
      name: "Nasi Goreng",
      category: "Makanan",
      sales: 98,
      trend: "up",
      percentage: 8,
    },
    {
      id: "3",
      name: "Es Teh Manis",
      category: "Minuman",
      sales: 87,
      trend: "down",
      percentage: 3,
    },
    {
      id: "4",
      name: "Ayam Goreng",
      category: "Makanan",
      sales: 76,
      trend: "stable",
      percentage: 0,
    },
    {
      id: "5",
      name: "Mie Goreng",
      category: "Makanan",
      sales: 65,
      trend: "up",
      percentage: 5,
    },
  ],
  title = "Produk Terlaris",
  period = "Hari Ini",
}: TopProductsProps) => {
  return (
    <Card className="h-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>{title}</span>
          <Badge variant="outline" className="text-xs font-normal">
            {period}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{product.sales} unit</span>
                {product.trend === "up" && (
                  <div className="flex items-center text-emerald-500 text-xs">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{product.percentage}%</span>
                  </div>
                )}
                {product.trend === "down" && (
                  <div className="flex items-center text-red-500 text-xs">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{product.percentage}%</span>
                  </div>
                )}
                {product.trend === "stable" && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>0%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
