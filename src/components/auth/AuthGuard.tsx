import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  requireAuth?: boolean;
  children?: React.ReactNode;
}

export const AuthGuard = ({ requireAuth = true, children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  console.log(
    `AuthGuard: path=${currentPath}, requireAuth=${requireAuth}, loading=${loading}, user=${user ? 'exists' : 'null'}`
  );

  // Show loading state while authentication is being determined
  if (loading) {
    console.log("AuthGuard: Still loading, showing spinner");
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Memuat...</h2>
          <p className="text-gray-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // TEMPORARILY DISABLED REDIRECTS
  // // Case 1: Requires auth but user is not logged in
  // if (requireAuth && !user) {
  //   console.log("AuthGuard: Redirecting to /login because auth required but no user");
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // // Case 2: Doesn't require auth but user is logged in (login/register pages)
  // if (!requireAuth && user && currentPath !== "/") {
  //   console.log("AuthGuard: Redirecting to / because user is already logged in");
  //   return <Navigate to="/" replace />;
  // }

  // For debugging: Check if we should allow access
  if (requireAuth && !user) {
    console.log("AuthGuard: Would normally redirect to /login, but temporarily allowing access");
  }
  
  if (!requireAuth && user && currentPath !== "/") {
    console.log("AuthGuard: Would normally redirect to /, but temporarily allowing access");
  }

  // Otherwise, render the protected component
  console.log("AuthGuard: Rendering protected content");
  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
