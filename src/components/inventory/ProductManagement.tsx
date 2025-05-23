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
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

type Product = Tables<"products">;
type Category = Tables<"categories">;
type ProductInsert = TablesInsert<"products">;
type ProductUpdate = TablesUpdate<"products">;

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  barcode: string;
  category_id: string;
  image_url: string;
}

const ProductManagement = () => {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
      if (editingProduct) {
        // Update existing product
        const updateData: ProductUpdate = {
          ...formData,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", editingProduct.id)
          .eq("company_id", userProfile.company_id);

        if (error) throw error;
      } else {
        // Create new product
        const insertData: ProductInsert = {
          ...formData,
          company_id: userProfile.company_id,
        };

        const { error } = await supabase.from("products").insert(insertData);

        if (error) throw error;
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      cost: product.cost || 0,
      sku: product.sku || "",
      barcode: product.barcode || "",
      category_id: product.category_id || "",
      image_url: product.image_url || "",
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
    });
    setEditingProduct(null);
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga Jual *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                    min="0"
                    step="100"
                    placeholder="0"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="SKU produk"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    placeholder="Barcode produk"
                  />
                </div>
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
