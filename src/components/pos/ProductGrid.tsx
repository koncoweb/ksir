import React from "react";
import { Product } from "./types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductGrid = ({ products, addToCart }: ProductGridProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 bg-white rounded-lg p-4 shadow-sm overflow-y-auto">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p>Tidak ada produk yang ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              onClick={() => addToCart(product)}
            >
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {product.stock <= 5 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Stok: {product.stock}
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex flex-col h-full">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
