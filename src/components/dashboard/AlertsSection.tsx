import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertCircle, Package } from "lucide-react";
import { Button } from "../ui/button";

interface AlertItem {
  id: string;
  type: "stock" | "order";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

interface AlertsSectionProps {
  stockAlerts?: AlertItem[];
  orderAlerts?: AlertItem[];
}

const AlertsSection = ({
  stockAlerts = [
    {
      id: "1",
      type: "stock",
      title: "Kopi Arabica",
      description: "Stok tersisa 5 dari minimum 10",
      severity: "high",
      timestamp: "2023-06-15T09:30:00",
    },
    {
      id: "2",
      type: "stock",
      title: "Gula Aren",
      description: "Stok tersisa 8 dari minimum 15",
      severity: "medium",
      timestamp: "2023-06-15T10:15:00",
    },
    {
      id: "3",
      type: "stock",
      title: "Susu UHT",
      description: "Stok tersisa 12 dari minimum 20",
      severity: "low",
      timestamp: "2023-06-15T11:00:00",
    },
  ],
  orderAlerts = [
    {
      id: "4",
      type: "order",
      title: "Pesanan #1234",
      description: "Menunggu konfirmasi pembayaran",
      severity: "medium",
      timestamp: "2023-06-15T08:45:00",
    },
    {
      id: "5",
      type: "order",
      title: "Pesanan #1235",
      description: "Siap untuk diambil",
      severity: "high",
      timestamp: "2023-06-15T09:15:00",
    },
  ],
}: AlertsSectionProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Peringatan Penting</h2>
          <Button variant="outline" size="sm">
            Lihat Semua
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stok Rendah */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-500" />
                Stok Rendah
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stockAlerts.length > 0 ? (
                <ul className="space-y-2">
                  {stockAlerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex items-start justify-between p-2 rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-500">
                          {alert.description}
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity === "high"
                          ? "Kritis"
                          : alert.severity === "medium"
                            ? "Perhatian"
                            : "Info"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Tidak ada peringatan stok rendah
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pesanan Tertunda */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                Pesanan Tertunda
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderAlerts.length > 0 ? (
                <ul className="space-y-2">
                  {orderAlerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex items-start justify-between p-2 rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-500">
                          {alert.description}
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity === "high"
                          ? "Segera"
                          : alert.severity === "medium"
                            ? "Perhatian"
                            : "Info"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Tidak ada pesanan tertunda
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertsSection;
