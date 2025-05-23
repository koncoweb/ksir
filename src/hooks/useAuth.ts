import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  company_id: string;
  company?: {
    id: string;
    name: string;
    slug: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          email,
          role,
          company_id,
          companies (
            id,
            name,
            slug
          )
        `,
        )
        .eq("id", userId)
        .single();

      if (error) throw error;

      setUserProfile({
        ...data,
        company: data.companies,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);

      // Clear user profile immediately for better UX
      setUserProfile(null);
      setUser(null);
      setSession(null);

      // Sign out from Supabase (this will also trigger the auth state change)
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }

      // Clear any cached data or local storage if needed
      localStorage.removeItem("supabase.auth.token");

      // Force clear all auth-related storage
      for (const key in localStorage) {
        if (key.includes("supabase") || key.includes("auth")) {
          localStorage.removeItem(key);
        }
      }

      return true; // Indicate successful logout
    } catch (error) {
      console.error("Error signing out:", error);
      // Re-fetch current state in case of error
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await fetchUserProfile(data.session.user.id);
      }
      return false; // Indicate failed logout
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    userProfile,
    loading,
    signOut,
    refetchProfile: () => (user ? fetchUserProfile(user.id) : null),
  };
}
