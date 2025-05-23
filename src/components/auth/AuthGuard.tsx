import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  requireAuth?: boolean;
  children?: React.ReactNode;
}

export const AuthGuard = ({ requireAuth = true, children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Memuat...</h2>
          <p className="text-gray-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // If we require auth and don't have a user, redirect to login
  if (requireAuth && !user) {
    console.log("AuthGuard: No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we don't require auth (login page) but have a user, redirect to home
  if (!requireAuth && user) {
    console.log("AuthGuard: User already logged in, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
