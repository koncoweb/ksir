import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Sidebar from "../layout/Sidebar";
import {
  Warehouse,
  Search,
  Filter,
  Plus,
  Package,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

const WarehouseManagement = () => {
  // Mock warehouse data
  const warehouses = [
    {
      id: 1,
      name: "Gudang Utama Jakarta",
      location: "Jakarta Selatan",
      capacity: 1000,
      currentStock: 750,
      manager: "Ahmad Rizki",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Gudang Cabang Bandung",
      location: "Bandung Barat",
      capacity: 500,
      currentStock: 320,
      manager: "Siti Nurhaliza",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Gudang Surabaya",
      location: "Surabaya Timur",
      capacity: 800,
      currentStock: 600,
      manager: "Budi Santoso",
      status: "Aktif",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manajemen Gudang</h1>
          <div className="flex gap-2">
            <Link to="/inventaris">
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" /> Kelola Stok
              </Button>
            </Link>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Gudang
            </Button>
          </div>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Daftar Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Cari gudang..."
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
                      Nama Gudang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kapasitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stok Saat Ini
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
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Warehouse className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {warehouse.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {warehouse.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {warehouse.capacity} unit
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {warehouse.currentStock} unit
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(
                            (warehouse.currentStock / warehouse.capacity) * 100,
                          )}
                          % terisi
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {warehouse.manager}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {warehouse.status}
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

export default WarehouseManagement;
