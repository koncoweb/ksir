import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface SalesData {
  date: string;
  amount: number;
}

interface SalesChartProps {
  title?: string;
  data?: {
    daily: SalesData[];
    weekly: SalesData[];
    monthly: SalesData[];
  };
}

const SalesChart = ({
  title = "Tren Penjualan",
  data = {
    daily: [
      { date: "08:00", amount: 120000 },
      { date: "10:00", amount: 250000 },
      { date: "12:00", amount: 380000 },
      { date: "14:00", amount: 290000 },
      { date: "16:00", amount: 410000 },
      { date: "18:00", amount: 350000 },
      { date: "20:00", amount: 280000 },
    ],
    weekly: [
      { date: "Senin", amount: 1250000 },
      { date: "Selasa", amount: 980000 },
      { date: "Rabu", amount: 1100000 },
      { date: "Kamis", amount: 1300000 },
      { date: "Jumat", amount: 1650000 },
      { date: "Sabtu", amount: 1850000 },
      { date: "Minggu", amount: 1450000 },
    ],
    monthly: [
      { date: "Jan", amount: 28500000 },
      { date: "Feb", amount: 32100000 },
      { date: "Mar", amount: 29800000 },
      { date: "Apr", amount: 31500000 },
      { date: "Mei", amount: 34200000 },
      { date: "Jun", amount: 36800000 },
    ],
  },
}: SalesChartProps) => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  // Calculate max value for chart scaling
  const currentData = data[period];
  const maxValue = Math.max(...currentData.map((item) => item.amount));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={chartType}
            onValueChange={(value) => setChartType(value as "bar" | "line")}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Tipe Grafik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="daily"
          value={period}
          onValueChange={(value) =>
            setPeriod(value as "daily" | "weekly" | "monthly")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">Hari Ini</TabsTrigger>
            <TabsTrigger value="weekly">Minggu Ini</TabsTrigger>
            <TabsTrigger value="monthly">Bulan Ini</TabsTrigger>
          </TabsList>

          {/* Chart container */}
          <div className="h-[250px] w-full mt-4 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-xs text-gray-500">
              <div>{formatCurrency(maxValue)}</div>
              <div>{formatCurrency(maxValue * 0.75)}</div>
              <div>{formatCurrency(maxValue * 0.5)}</div>
              <div>{formatCurrency(maxValue * 0.25)}</div>
              <div>Rp0</div>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full flex items-end">
              <div className="w-full h-full flex items-end justify-between relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0.25, 0.5, 0.75, 1].map((level) => (
                    <div
                      key={level}
                      className="w-full border-t border-gray-200"
                      style={{ height: `${level * 100}%` }}
                    />
                  ))}
                </div>

                {/* Chart bars or lines */}
                <div className="relative z-10 w-full h-full flex items-end justify-between">
                  {currentData.map((item, index) => {
                    const heightPercentage = (item.amount / maxValue) * 100;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end h-full"
                      >
                        {chartType === "bar" ? (
                          <div
                            className="w-8 bg-blue-500 rounded-t-sm transition-all duration-300"
                            style={{ height: `${heightPercentage}%` }}
                          />
                        ) : (
                          <div className="w-2 h-2 bg-blue-500 rounded-full relative">
                            {index < currentData.length - 1 && (
                              <div
                                className="absolute h-[2px] bg-blue-500"
                                style={{
                                  width: `calc(100% + 2rem)`,
                                  top: "50%",
                                  left: "50%",
                                  transform: `rotate(${
                                    Math.atan2(
                                      ((currentData[index + 1].amount /
                                        maxValue) *
                                        100 -
                                        heightPercentage) *
                                        2,
                                      100,
                                    ) *
                                    (180 / Math.PI)
                                  }deg)`,
                                  transformOrigin: "left center",
                                }}
                              />
                            )}
                          </div>
                        )}
                        <span className="text-xs text-gray-500 mt-1">
                          {item.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Total summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Penjualan:</span>
              <span className="text-lg font-bold">
                {formatCurrency(
                  currentData.reduce((sum, item) => sum + item.amount, 0),
                )}
              </span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
