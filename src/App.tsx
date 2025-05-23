import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Sales from "./components/sales";
import Inventory from "./components/inventory";
import Reports from "./components/reports";
import Users from "./components/users";
import Settings from "./components/settings";
import WarehouseManagement from "./components/warehouse";
import StoreManagement from "./components/store";
import POS from "./components/pos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import AuthLayout from "./components/auth/AuthLayout";
import AuthGuard from "./components/auth/AuthGuard";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import AuthProvider from "./components/auth/AuthProvider";

import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";

// Import tempo routes only if in Tempo environment
const TempoRoutes = () => {
  if (import.meta.env.VITE_TEMPO === "true") {
    return useRoutes(routes);
  }
  return null;
};

function MainLayout({ children }) {
  console.log("MainLayout rendered");
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function App() {
  console.log("App component rendered");
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        {/* Tempo routes for storyboards - rendered separately */}
        <TempoRoutes />

        <Routes>
          {/* Auth routes - no authentication required */}
          <Route element={<AuthGuard requireAuth={false} />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Route>
          </Route>

          {/* Protected routes - authentication required */}
          <Route element={<AuthGuard requireAuth={true} />}>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/pos"
              element={
                <MainLayout>
                  <POS />
                </MainLayout>
              }
            />
            <Route
              path="/penjualan"
              element={
                <MainLayout>
                  <Sales />
                </MainLayout>
              }
            />
            <Route
              path="/inventaris"
              element={
                <MainLayout>
                  <Inventory />
                </MainLayout>
              }
            />
            <Route
              path="/gudang"
              element={
                <MainLayout>
                  <WarehouseManagement />
                </MainLayout>
              }
            />
            <Route
              path="/toko"
              element={
                <MainLayout>
                  <StoreManagement />
                </MainLayout>
              }
            />
            <Route
              path="/laporan"
              element={
                <MainLayout>
                  <Reports />
                </MainLayout>
              }
            />
            <Route
              path="/pengguna"
              element={
                <MainLayout>
                  <Users />
                </MainLayout>
              }
            />
            <Route
              path="/pengaturan"
              element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
          </Route>

          {/* Tempo routes placeholder */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}

          {/* Fallback route for 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                Halaman tidak ditemukan
              </div>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
