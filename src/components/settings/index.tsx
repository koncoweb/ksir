import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Sidebar from "../layout/Sidebar";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Pengaturan</h1>
        </div>

        <Tabs defaultValue="store">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="store">Toko</TabsTrigger>
            <TabsTrigger value="payment">Pembayaran</TabsTrigger>
            <TabsTrigger value="receipt">Struk</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Toko</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Nama Toko</Label>
                    <Input id="store-name" defaultValue="KasirSmart UMKM" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Nomor Telepon</Label>
                    <Input id="store-phone" defaultValue="+62 812 3456 7890" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Alamat</Label>
                  <Input
                    id="store-address"
                    defaultValue="Jl. Pahlawan No. 123, Jakarta Selatan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-description">Deskripsi</Label>
                  <Input
                    id="store-description"
                    defaultValue="Toko Kopi dan Makanan Ringan"
                  />
                </div>

                <Button>
                  <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jam Operasional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Senin - Jumat</h3>
                      <p className="text-sm text-gray-500">08:00 - 21:00</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ubah
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Sabtu</h3>
                      <p className="text-sm text-gray-500">09:00 - 22:00</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ubah
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Minggu</h3>
                      <p className="text-sm text-gray-500">10:00 - 20:00</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ubah
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-cash" defaultChecked />
                      <Label htmlFor="payment-cash">Tunai</Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-qris" defaultChecked />
                      <Label htmlFor="payment-qris">QRIS</Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-ewallet" defaultChecked />
                      <Label htmlFor="payment-ewallet">E-Wallet</Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-card" />
                      <Label htmlFor="payment-card">Kartu Debit/Kredit</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipt">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Struk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Pengaturan struk akan ditampilkan di sini.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Pengaturan sistem akan ditampilkan di sini.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
