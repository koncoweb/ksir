import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and handle the callback
        const { error } = await supabase.auth.getSession();

        if (error) throw error;

        // Redirect to the dashboard or home page
        navigate("/");
      } catch (error: any) {
        console.error("Error during auth callback:", error);
        setError(error.message);
        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
          <p className="text-gray-500">
            Please wait while we verify your credentials.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
