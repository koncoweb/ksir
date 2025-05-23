import React, { useState } from "react";
import { CartItem } from "./types";
import { Button } from "../ui/button";
import { Trash2, Minus, Plus, X, Receipt, CreditCard, Tag } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface ShoppingCartProps {
  cartItems: CartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  totalAmount: number;
  onClose?: () => void;
}

const ShoppingCart = ({
  cartItems,
  updateQuantity,
  removeItem,
  totalAmount,
  onClose,
}: ShoppingCartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-bold">Keranjang Belanja</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <Receipt className="h-6 w-6" />
          </div>
          <p className="text-center">Keranjang belanja kosong</p>
          <p className="text-sm text-center mt-1">
            Tambahkan produk untuk memulai transaksi
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.variation.id}`}
                  className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.product.name}
                      {item.variation && item.variation.name !== "Default" && (
                        <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                          {item.variation.name}
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>
                        {formatCurrency(
                          item.isWholesale && item.variation.wholesalePrice
                            ? item.variation.wholesalePrice
                            : item.variation.price,
                        )}
                      </span>
                      {item.variation.wholesalePrice &&
                        item.quantity >=
                          (item.variation.minWholesaleQty || 1) && (
                          <button
                            className="ml-2 flex items-center text-xs text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedItems = [...cartItems];
                              const index = updatedItems.findIndex(
                                (i) =>
                                  i.product.id === item.product.id &&
                                  i.variation.id === item.variation.id,
                              );
                              if (index !== -1) {
                                updatedItems[index] = {
                                  ...updatedItems[index],
                                  isWholesale: !item.isWholesale,
                                };
                                // Update cart with the new items
                                // This would need to be implemented in the parent component
                              }
                            }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {item.isWholesale ? "Grosir" : "Retail"}
                          </button>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pajak (11%)</span>
                <span className="font-medium">
                  {formatCurrency(totalAmount * 0.11)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {formatCurrency(totalAmount + totalAmount * 0.11)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" className="w-full">
                  <Receipt className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Bayar
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
