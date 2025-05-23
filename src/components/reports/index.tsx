import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Sidebar from "../layout/Sidebar";
import { BarChart3, Download, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SalesChart from "../dashboard/SalesChart";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Laporan</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> Pilih Periode
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Ekspor
            </Button>
          </div>
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="sales">Penjualan</TabsTrigger>
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="profit">Keuntungan</TabsTrigger>
            <TabsTrigger value="inventory">Inventaris</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Penjualan</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Penjualan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">Total Penjualan</div>
                    <div className="text-2xl font-bold">Rp 12.580.000</div>
                    <div className="text-xs text-blue-600">
                      +8% dari bulan lalu
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">
                      Jumlah Transaksi
                    </div>
                    <div className="text-2xl font-bold">248</div>
                    <div className="text-xs text-green-600">
                      +12% dari bulan lalu
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600">
                      Rata-rata Transaksi
                    </div>
                    <div className="text-2xl font-bold">Rp 50.725</div>
                    <div className="text-xs text-purple-600">
                      -3% dari bulan lalu
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Data produk terlaris akan ditampilkan di sini.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profit">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Keuntungan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Data keuntungan akan ditampilkan di sini.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Inventaris</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Data inventaris akan ditampilkan di sini.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
