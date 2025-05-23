import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Sidebar from "../layout/Sidebar";
import {
  Store,
  Search,
  Filter,
  Plus,
  Package,
  ArrowUpDown,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

const StoreManagement = () => {
  // Mock store data
  const stores = [
    {
      id: 1,
      name: "Toko Pusat Jakarta",
      location: "Jakarta Pusat",
      type: "Flagship Store",
      currentStock: 150,
      dailySales: 25,
      manager: "Dewi Sartika",
      status: "Buka",
    },
    {
      id: 2,
      name: "Cabang Bandung",
      location: "Bandung Kota",
      type: "Cabang",
      currentStock: 80,
      dailySales: 15,
      manager: "Andi Wijaya",
      status: "Buka",
    },
    {
      id: 3,
      name: "Outlet Surabaya",
      location: "Surabaya Pusat",
      type: "Outlet",
      currentStock: 45,
      dailySales: 8,
      manager: "Maya Sari",
      status: "Buka",
    },
    {
      id: 4,
      name: "Kios Yogyakarta",
      location: "Yogyakarta",
      type: "Kios",
      currentStock: 20,
      dailySales: 5,
      manager: "Rudi Hartono",
      status: "Tutup",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manajemen Toko</h1>
          <div className="flex gap-2">
            <Link to="/inventaris">
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" /> Kelola Stok
              </Button>
            </Link>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Toko
            </Button>
          </div>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Daftar Toko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Cari toko..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Toko
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stok Saat Ini
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penjualan Harian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Store className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {store.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {store.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {store.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {store.currentStock} unit
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {store.dailySales} transaksi
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {store.manager}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            store.status === "Buka"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {store.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm" className="mr-2">
                          <ArrowUpDown className="h-4 w-4 mr-1" />
                          Transfer Stok
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StoreManagement;
