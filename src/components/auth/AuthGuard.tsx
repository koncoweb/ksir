import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  requireAuth?: boolean;
  children?: React.ReactNode;
}

export const AuthGuard = ({ requireAuth = true, children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if not authenticated
        navigate("/login", { state: { from: location }, replace: true });
      } else if (!requireAuth && user && location.pathname !== "/") {
        // Redirect to home if already logged in and not on home
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, requireAuth, location, navigate]);

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

  // Only render children/outlet if not redirecting
  if ((requireAuth && !user) || (!requireAuth && user && location.pathname !== "/")) {
    return null;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
