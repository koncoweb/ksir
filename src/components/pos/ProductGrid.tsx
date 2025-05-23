import React, { useState } from "react";
import { Product, ProductVariation } from "./types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface ProductGridProps {
  products: Product[];
  addToCart: (product: Product, variation: ProductVariation) => void;
}

const ProductGrid = ({ products, addToCart }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleProductClick = (product: Product) => {
    // If product has variations, show dialog to select variation
    if (product.variations && product.variations.length > 1) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
    } else {
      // If no variations or only one variation, add directly to cart
      const variation =
        product.variations && product.variations.length > 0
          ? product.variations[0]
          : {
              id: "default",
              name: "Default",
              price: product.price,
              stock: product.stock,
            };
      addToCart(product, variation);
    }
  };

  const handleVariationSelect = (variation: ProductVariation) => {
    if (selectedProduct) {
      addToCart(selectedProduct, variation);
      setIsDialogOpen(false);
      setSelectedProduct(null);
    }
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
              onClick={() => handleProductClick(product)}
            >
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {product.variations && product.variations.length > 1 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <ChevronDown className="h-3 w-3 mr-1" />
                    {product.variations.length} variasi
                  </div>
                )}
                {product.variations && product.variations[0]?.stock <= 5 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Stok: {product.variations[0].stock}
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
                        handleProductClick(product);
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

      {/* Variation Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Variasi Produk</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {selectedProduct?.variations?.map((variation) => (
              <Card
                key={variation.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleVariationSelect(variation)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{variation.name}</h3>
                    <p className="text-sm text-gray-500">
                      Stok: {variation.stock} unit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(variation.price)}
                    </p>
                    {variation.wholesalePrice && (
                      <p className="text-xs text-gray-500">
                        Grosir: {formatCurrency(variation.wholesalePrice)}
                        <br />
                        Min: {variation.minWholesaleQty} unit
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGrid;
