import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  PercentIcon,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon = <DollarSignIcon className="h-5 w-5" />,
  trend = { value: "0%", isPositive: true },
  description = "Dibandingkan kemarin",
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="rounded-full bg-gray-100 p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-2 flex items-center text-xs">
          <span
            className={`mr-1 flex items-center ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {trend.isPositive ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            {trend.value}
          </span>
          <span className="text-gray-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsOverviewProps {
  metrics?: {
    totalSales: string;
    transactionCount: string;
    averageTransaction: string;
    profit: string;
  };
}

const MetricsOverview = ({
  metrics = {
    totalSales: "Rp 2.450.000",
    transactionCount: "48",
    averageTransaction: "Rp 51.042",
    profit: "Rp 735.000",
  },
}: MetricsOverviewProps) => {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Ringkasan Hari Ini</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Penjualan"
          value={metrics.totalSales}
          icon={<DollarSignIcon className="h-5 w-5 text-blue-500" />}
          trend={{ value: "12%", isPositive: true }}
        />
        <MetricCard
          title="Jumlah Transaksi"
          value={metrics.transactionCount}
          icon={<ShoppingCartIcon className="h-5 w-5 text-purple-500" />}
          trend={{ value: "8%", isPositive: true }}
        />
        <MetricCard
          title="Rata-rata Transaksi"
          value={metrics.averageTransaction}
          icon={<TrendingUpIcon className="h-5 w-5 text-orange-500" />}
          trend={{ value: "3%", isPositive: true }}
        />
        <MetricCard
          title="Profit Hari Ini"
          value={metrics.profit}
          icon={<PercentIcon className="h-5 w-5 text-green-500" />}
          trend={{ value: "5%", isPositive: false }}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
