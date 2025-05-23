import React from "react";
import MetricsOverview from "./dashboard/MetricsOverview";
import AlertsSection from "./dashboard/AlertsSection";
import QuickAccess from "./dashboard/QuickAccess";
import SalesChart from "./dashboard/SalesChart";
import TopProducts from "./dashboard/TopProducts";
import { Button } from "./ui/button";
import { Bell, Calendar, Settings, User } from "lucide-react";

const Home = () => {
  // Mock handlers for quick access buttons
  const handleNewTransaction = () => {
    console.log("Navigate to new transaction");
  };

  const handleAddProduct = () => {
    console.log("Navigate to add product");
  };

  const handleStockCheck = () => {
    console.log("Navigate to stock check");
  };

  const handleDailyReport = () => {
    console.log("Navigate to daily report");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Date and welcome message */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Selamat Datang, Admin!</h2>
          <p className="text-gray-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Lihat Kalender
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview />

      {/* Quick Access */}
      <QuickAccess
        onNewTransaction={handleNewTransaction}
        onAddProduct={handleAddProduct}
        onStockCheck={handleStockCheck}
        onDailyReport={handleDailyReport}
      />

      {/* Alerts Section */}
      <AlertsSection />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default Home;
