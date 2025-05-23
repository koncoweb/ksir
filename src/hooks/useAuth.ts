import { useState, useEffect, useRef } from "react";
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

// Create a cache to store user profiles across hook instances
const userProfileCache = new Map<string, UserProfile>();

// Track if we're already fetching a profile to prevent duplicate requests
const pendingFetches = new Set<string>();

// No need for global initialization flags. Supabase client is a singleton via import.

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Use a ref to track if this instance has been initialized
  const isInstanceInitialized = useRef(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if we already have this profile in cache
      if (userProfileCache.has(userId)) {
        setUserProfile(userProfileCache.get(userId)!);
        return;
      }

      // First try to get just the user data without the company join
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, role, company_id")
        .eq("id", userId)
        .single();

      if (userError) {
        // If you see error code 42P17 (infinite recursion), fix your Supabase RLS policy for 'users' table.
        console.error("Error fetching user data:", userError);
        throw userError;
      }

      // If we have user data, try to get the company data separately
      if (userData && userData.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("id, name, slug")
          .eq("id", userData.company_id)
          .single();

        if (!companyError && companyData) {
          const profileWithCompany = {
            ...userData,
            company: companyData,
          };

          // Cache the profile
          userProfileCache.set(userId, profileWithCompany);
          setUserProfile(profileWithCompany);
          return;
        } else if (companyError) {
          console.error("Error fetching company data:", companyError);
        }
      }

      // If we couldn't get company data or there was no company_id, just use the user data
      const profileWithoutCompany = {
        ...userData,
        company: null,
      };

      // Cache the profile
      userProfileCache.set(userId, profileWithoutCompany);
      setUserProfile(profileWithoutCompany);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    if (!isInstanceInitialized.current) {
      console.log("useAuth hook initialized");
      isInstanceInitialized.current = true;
    }

    let unsub: any;
    let authStateFired = false;

    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      }
    };

    getInitialSession();

    unsub = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!authStateFired) {
        setLoading(false);
        setInitialized(true);
        authStateFired = true;
      }
    });

    return () => {
      if (unsub && unsub.subscription) unsub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("[useAuth] loading:", loading, "user:", user);
  }, [loading, user]);

  // Only fetch user profile when user id changes
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      setUserProfile(null);
    }
  }, [user?.id]);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Starting logout process...");

      // Clear state first for better UX
      setUserProfile(null);
      setUser(null);
      setSession(null);

      // Clear the cache when signing out
      userProfileCache.clear();
      pendingFetches.clear();

      // No global initialization state to reset

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }

      console.log("Supabase signOut completed successfully");

      // Clear any cached data or local storage
      try {
        // Clear specific Supabase items
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("supabase.auth.expires_at");
        localStorage.removeItem("supabase.auth.refresh_token");

        // Force clear all auth-related storage as a fallback
        for (const key in localStorage) {
          if (key.includes("supabase") || key.includes("auth")) {
            localStorage.removeItem(key);
          }
        }
        console.log("Local storage cleared");
      } catch (storageError) {
        console.error("Error clearing local storage:", storageError);
        // Continue with logout even if storage clearing fails
      }

      return true; // Indicate successful logout
    } catch (error) {
      console.error("Error signing out:", error);
      // Re-fetch current state in case of error
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (refreshError) {
        console.error(
          "Error refreshing session after failed logout:",
          refreshError,
        );
      }
      return false; // Indicate failed logout
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    userProfileCache.clear();
    pendingFetches.clear();
    console.log("User profile cache cleared");
  };

  return {
    user,
    session,
    userProfile,
    loading,
    signOut,
    refetchProfile: () => (user ? fetchUserProfile(user.id) : null),
    clearCache,
  };
}
