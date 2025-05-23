import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
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
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
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
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Home />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/pos"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <POS />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/penjualan"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Sales />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/inventaris"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Inventory />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/gudang"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <WarehouseManagement />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/toko"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <StoreManagement />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/laporan"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Reports />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/pengguna"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Users />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/pengaturan"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Settings />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <div className="min-h-screen bg-gray-100">
                  <Header />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1">
                      <Profile />
                    </main>
                  </div>
                </div>
              }
            />
          </Route>

          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
