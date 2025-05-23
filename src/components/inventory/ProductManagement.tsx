import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

type Product = Tables<"products">;
type Category = Tables<"categories">;
type ProductVariation = Tables<"product_variations">;
type ProductInsert = TablesInsert<"products">;
type ProductUpdate = TablesUpdate<"products">;
type ProductVariationInsert = TablesInsert<"product_variations">;
type ProductVariationUpdate = TablesUpdate<"product_variations">;

interface ProductVariationData {
  id?: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  wholesale_price: number | null;
  min_wholesale_qty: number | null;
  is_active?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  barcode: string;
  category_id: string;
  image_url: string;
  variations: ProductVariationData[];
}

const ProductManagement = () => {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productVariations, setProductVariations] = useState<
    Record<string, ProductVariation[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    cost: 0,
    sku: "",
    barcode: "",
    category_id: "",
    image_url: "",
    variations: [
      {
        name: "Default",
        sku: "",
        barcode: "",
        price: 0,
        wholesale_price: null,
        min_wholesale_qty: null,
      },
    ],
  });

  // Check if user has permission to manage products
  const canManageProducts =
    userProfile?.role === "admin" || userProfile?.role === "pemilik";

  useEffect(() => {
    if (userProfile?.company_id) {
      fetchProducts();
      fetchCategories();
    }
  }, [userProfile?.company_id]);

  useEffect(() => {
    if (products.length > 0) {
      fetchProductVariations();
    }
  }, [products]);

  const fetchProducts = async () => {
    if (!userProfile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("company_id", userProfile.company_id)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductVariations = async () => {
    if (!userProfile?.company_id || products.length === 0) return;

    try {
      const productIds = products.map((p) => p.id);
      const { data, error } = await supabase
        .from("product_variations")
        .select("*")
        .in("product_id", productIds)
        .eq("is_active", true);

      if (error) throw error;

      // Group variations by product_id
      const variationsByProduct: Record<string, ProductVariation[]> = {};
      data?.forEach((variation) => {
        if (!variationsByProduct[variation.product_id]) {
          variationsByProduct[variation.product_id] = [];
        }
        variationsByProduct[variation.product_id].push(variation);
      });

      setProductVariations(variationsByProduct);
    } catch (error) {
      console.error("Error fetching product variations:", error);
    }
  };

  const fetchCategories = async () => {
    if (!userProfile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("company_id", userProfile.company_id)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.company_id || !canManageProducts) return;

    try {
      let productId: string;

      if (editingProduct) {
        // Update existing product
        const { variations, ...productData } = formData;
        const updateData: ProductUpdate = {
          ...productData,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", editingProduct.id)
          .eq("company_id", userProfile.company_id);

        if (error) throw error;
        productId = editingProduct.id;

        // Handle variations for existing product
        await handleProductVariations(productId, variations);
      } else {
        // Create new product
        const { variations, ...productData } = formData;
        const insertData: ProductInsert = {
          ...productData,
          company_id: userProfile.company_id,
        };

        const { data, error } = await supabase
          .from("products")
          .insert(insertData)
          .select();

        if (error) throw error;
        productId = data?.[0]?.id;

        if (productId) {
          // Create variations for new product
          await handleProductVariations(productId, variations);
        }
      }

      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Terjadi kesalahan saat menyimpan produk");
    }
  };

  const handleProductVariations = async (
    productId: string,
    variations: ProductVariationData[],
  ) => {
    // Get existing variations for this product
    const { data: existingVariations, error: fetchError } = await supabase
      .from("product_variations")
      .select("*")
      .eq("product_id", productId);

    if (fetchError) throw fetchError;

    const existingVariationMap = new Map();
    existingVariations?.forEach((v) => existingVariationMap.set(v.id, v));

    // Process each variation
    for (const variation of variations) {
      if (variation.id) {
        // Update existing variation
        const { id, ...updateData } = variation;
        const { error } = await supabase
          .from("product_variations")
          .update(updateData)
          .eq("id", id)
          .eq("product_id", productId);

        if (error) throw error;
        existingVariationMap.delete(id);
      } else {
        // Create new variation
        const { error } = await supabase.from("product_variations").insert({
          ...variation,
          product_id: productId,
        });

        if (error) throw error;
      }
    }

    // Deactivate variations that were removed (mark as inactive instead of deleting)
    for (const [id, _] of existingVariationMap) {
      const { error } = await supabase
        .from("product_variations")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);

    // Get variations for this product
    let variations = productVariations[product.id] || [];

    // If no variations found, fetch them
    if (variations.length === 0) {
      const { data, error } = await supabase
        .from("product_variations")
        .select("*")
        .eq("product_id", product.id)
        .eq("is_active", true);

      if (!error && data) {
        variations = data;
      }
    }

    // If still no variations, create a default one
    if (variations.length === 0) {
      variations = [
        {
          id: undefined,
          name: "Default",
          sku: product.sku || "",
          barcode: product.barcode || "",
          price: product.price,
          wholesale_price: null,
          min_wholesale_qty: null,
          is_active: true,
          product_id: product.id,
          created_at: null,
          updated_at: null,
        },
      ];
    }

    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      cost: product.cost || 0,
      sku: product.sku || "",
      barcode: product.barcode || "",
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      variations: variations.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku || "",
        barcode: v.barcode || "",
        price: v.price,
        wholesale_price: v.wholesale_price,
        min_wholesale_qty: v.min_wholesale_qty,
      })),
    });

    setIsDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!userProfile?.company_id || !canManageProducts) return;

    if (
      !confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", product.id)
        .eq("company_id", userProfile.company_id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan saat menghapus produk");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      cost: 0,
      sku: "",
      barcode: "",
      category_id: "",
      image_url: "",
      variations: [
        {
          name: "Default",
          sku: "",
          barcode: "",
          price: 0,
          wholesale_price: null,
          min_wholesale_qty: null,
        },
      ],
    });
    setEditingProduct(null);
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [
        ...formData.variations,
        {
          name: "",
          sku: "",
          barcode: "",
          price: formData.price,
          wholesale_price: null,
          min_wholesale_qty: null,
        },
      ],
    });
  };

  const removeVariation = (index: number) => {
    if (formData.variations.length <= 1) {
      alert("Produk harus memiliki minimal satu variasi");
      return;
    }

    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);

    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const updateVariation = (
    index: number,
    field: keyof ProductVariationData,
    value: any,
  ) => {
    const newVariations = [...formData.variations];
    newVariations[index] = {
      ...newVariations[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (!canManageProducts) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p>Anda tidak memiliki izin untuk mengelola produk.</p>
            <p className="text-sm">
              Hanya admin dan pemilik yang dapat mengelola produk.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">Memuat data produk...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Produk</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Ubah informasi produk di bawah ini."
                  : "Masukkan informasi produk baru."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Masukkan nama produk"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Masukkan deskripsi produk"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Harga Beli</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: Number(e.target.value) })
                  }
                  min="0"
                  step="100"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Variasi Produk</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariation}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tambah Variasi
                  </Button>
                </div>

                {formData.variations.map((variation, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 mb-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Variasi {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`variation-name-${index}`}>
                          Nama Variasi *
                        </Label>
                        <Input
                          id={`variation-name-${index}`}
                          value={variation.name}
                          onChange={(e) =>
                            updateVariation(index, "name", e.target.value)
                          }
                          required
                          placeholder="Contoh: Regular, Large, dll"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`variation-sku-${index}`}>SKU</Label>
                          <Input
                            id={`variation-sku-${index}`}
                            value={variation.sku}
                            onChange={(e) =>
                              updateVariation(index, "sku", e.target.value)
                            }
                            placeholder="SKU variasi"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`variation-barcode-${index}`}>
                            Barcode
                          </Label>
                          <Input
                            id={`variation-barcode-${index}`}
                            value={variation.barcode}
                            onChange={(e) =>
                              updateVariation(index, "barcode", e.target.value)
                            }
                            placeholder="Barcode variasi"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`variation-price-${index}`}>
                          Harga Jual *
                        </Label>
                        <Input
                          id={`variation-price-${index}`}
                          type="number"
                          value={variation.price}
                          onChange={(e) =>
                            updateVariation(
                              index,
                              "price",
                              Number(e.target.value),
                            )
                          }
                          required
                          min="0"
                          step="100"
                          placeholder="0"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`variation-wholesale-price-${index}`}>
                            Harga Grosir
                          </Label>
                          <Input
                            id={`variation-wholesale-price-${index}`}
                            type="number"
                            value={variation.wholesale_price || ""}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "wholesale_price",
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                            min="0"
                            step="100"
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`variation-min-qty-${index}`}>
                            Min. Qty Grosir
                          </Label>
                          <Input
                            id={`variation-min-qty-${index}`}
                            type="number"
                            value={variation.min_wholesale_qty || ""}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "min_wholesale_qty",
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                            min="0"
                            step="1"
                            placeholder="10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>Belum ada produk yang ditambahkan.</p>
                <p className="text-sm">
                  Klik tombol "Tambah Produk" untuk memulai.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => {
            const category = categories.find(
              (cat) => cat.id === product.category_id,
            );
            return (
              <Card key={product.id} className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category?.name || "Tanpa Kategori"}
                        </p>
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {product.sku && <span>SKU: {product.sku}</span>}
                          {product.barcode && (
                            <span>Barcode: {product.barcode}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(product.price)}
                        </div>
                        {product.cost && (
                          <div className="text-sm text-gray-500">
                            Modal:{" "}
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(product.cost)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
