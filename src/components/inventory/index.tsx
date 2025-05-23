import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Sidebar from "../layout/Sidebar";
import ProductManagement from "./ProductManagement";
import { useAuth } from "@/hooks/useAuth";
import {
  Package,
  Search,
  Filter,
  Plus,
  Warehouse,
  Store,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

const Inventory = () => {
  const { userProfile } = useAuth();
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [activeTab, setActiveTab] = useState<"inventory" | "management">(
    "inventory",
  );

  // Check if user can manage products
  const canManageProducts =
    userProfile?.role === "admin" || userProfile?.role === "pemilik";

  // Toggle individual product expansion
  const toggleProductExpansion = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.company_id) {
      fetchInventoryData();
    }
  }, [userProfile?.company_id]);

  const fetchInventoryData = async () => {
    if (!userProfile?.company_id) return;

    try {
      setIsLoading(true);

      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("company_id", userProfile.company_id)
        .eq("is_active", true);

      if (productsError) throw productsError;

      // Fetch product variations
      const productIds = products.map((p) => p.id);
      const { data: variations, error: variationsError } = await supabase
        .from("product_variations")
        .select("*")
        .in("product_id", productIds)
        .eq("is_active", true);

      if (variationsError) throw variationsError;

      // Group variations by product_id
      const variationsByProduct = {};
      variations.forEach((v) => {
        if (!variationsByProduct[v.product_id]) {
          variationsByProduct[v.product_id] = [];
        }
        variationsByProduct[v.product_id].push(v);
      });

      // Fetch inventory data
      const variationIds = variations.map((v) => v.id);
      const { data: inventory, error: inventoryError } = await supabase
        .from("inventory")
        .select("*")
        .in("variation_id", variationIds)
        .eq("company_id", userProfile.company_id);

      if (inventoryError) throw inventoryError;

      // Group inventory by variation_id
      const inventoryByVariation = {};
      inventory.forEach((item) => {
        if (!inventoryByVariation[item.variation_id]) {
          inventoryByVariation[item.variation_id] = [];
        }
        inventoryByVariation[item.variation_id].push(item);
      });

      // Build the inventory items structure
      const items = products.map((product) => {
        const productVariations = variationsByProduct[product.id] || [];

        // If no variations found, create a default one
        if (productVariations.length === 0) {
          productVariations.push({
            id: `default-${product.id}`,
            name: "Default",
            price: product.price,
            product_id: product.id,
          });
        }

        return {
          id: product.id,
          name: product.name,
          category: product.categories?.name || "Tanpa Kategori",
          minStock: 10, // Default value, should be customizable per product
          price: product.price,
          variations: productVariations.map((variation) => ({
            id: variation.id,
            name: variation.name,
            locations: inventoryByVariation[variation.id]
              ? inventoryByVariation[variation.id].map((inv) => ({
                  type: inv.location_type,
                  name: inv.location_name,
                  stock: inv.quantity,
                }))
              : [],
          })),
        };
      });

      setInventoryItems(items);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total stock for each product
  const getProductTotalStock = (product) => {
    return product.variations.reduce((total, variation) => {
      return (
        total +
        variation.locations.reduce(
          (varTotal, location) => varTotal + location.stock,
          0,
        )
      );
    }, 0);
  };

  // Get stock status based on total stock and minimum stock
  const getStockStatus = (product) => {
    const totalStock = getProductTotalStock(product);
    if (totalStock === 0)
      return { status: "Habis", color: "bg-red-100 text-red-800" };
    if (totalStock < product.minStock)
      return { status: "Stok Rendah", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Tersedia", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Inventaris</h1>
          <div className="flex gap-2">
            <Link to="/gudang">
              <Button variant="outline">
                <Warehouse className="mr-2 h-4 w-4" /> Kelola Gudang
              </Button>
            </Link>
            <Link to="/toko">
              <Button variant="outline">
                <Store className="mr-2 h-4 w-4" /> Kelola Toko
              </Button>
            </Link>
            {canManageProducts && (
              <Button
                variant={activeTab === "management" ? "default" : "outline"}
                onClick={() =>
                  setActiveTab(
                    activeTab === "management" ? "inventory" : "management",
                  )
                }
              >
                <Settings className="mr-2 h-4 w-4" />
                {activeTab === "management"
                  ? "Lihat Inventaris"
                  : "Kelola Produk"}
              </Button>
            )}
          </div>
        </div>

        {activeTab === "management" ? (
          <ProductManagement />
        ) : (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Produk</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLocationDetails(!showLocationDetails)}
                    className="flex items-center gap-2"
                  >
                    {showLocationDetails ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Sembunyikan Detail Lokasi
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Tampilkan Detail Lokasi
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Cari produk..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {inventoryItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const totalStock = getProductTotalStock(item);

                  const isExpanded = expandedProducts.has(item.id);
                  const shouldShowDetails = showLocationDetails || isExpanded;

                  return (
                    <Card key={item.id} className="bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Package className="h-8 w-8 text-gray-400" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(item.price)}
                              </div>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}
                              >
                                {stockStatus.status}
                              </span>
                            </div>
                            {!showLocationDetails && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProductExpansion(item.id)}
                                className="flex items-center gap-1"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Total Stok:
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {totalStock} unit
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Minimum stok: {item.minStock} unit
                          </div>
                        </div>

                        {shouldShowDetails && (
                          <div className="space-y-3">
                            {item.variations.map((variation) => {
                              const variationTotal = variation.locations.reduce(
                                (total, location) => total + location.stock,
                                0,
                              );

                              return (
                                <div
                                  key={variation.id}
                                  className="border rounded-lg p-4 bg-gray-50"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">
                                      Variasi: {variation.name}
                                    </h4>
                                    <span className="text-sm font-semibold text-gray-700">
                                      {variationTotal} unit
                                    </span>
                                  </div>

                                  {variation.locations.length === 0 ? (
                                    <div className="text-sm text-gray-500 italic">
                                      Tidak ada stok tersedia
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {variation.locations.map(
                                        (location, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-white rounded border"
                                          >
                                            <div className="flex items-center space-x-2">
                                              {location.type === "warehouse" ? (
                                                <Warehouse className="h-4 w-4 text-blue-500" />
                                              ) : (
                                                <Store className="h-4 w-4 text-green-500" />
                                              )}
                                              <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                  {location.name}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                  {location.type}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                              {location.stock} unit
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Inventory;
