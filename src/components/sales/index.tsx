import React from "react";
import SalesChart from "../dashboard/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Sidebar from "../layout/Sidebar";

const Sales = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Penjualan</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Ringkasan Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Sales;
