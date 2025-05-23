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

// Create a singleton instance to track initialization
let isInitialized = false;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Use a ref to track if this instance has been initialized
  const isInstanceInitialized = useRef(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if we already have this profile in cache
      if (userProfileCache.has(userId)) {
        const cachedProfile = userProfileCache.get(userId);
        console.log("Using cached user profile for ID:", userId);
        setUserProfile(cachedProfile);
        return;
      }

      // Check if we're already fetching this profile
      if (pendingFetches.has(userId)) {
        console.log("Profile fetch already in progress for ID:", userId);
        return;
      }

      pendingFetches.add(userId);
      console.log("Fetching user profile for ID:", userId);

      // First try to get just the user data without the company join
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, role, company_id")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        pendingFetches.delete(userId);
        throw userError;
      }

      console.log("User data fetched:", userData);

      // If we have user data, try to get the company data separately
      if (userData && userData.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("id, name, slug")
          .eq("id", userData.company_id)
          .single();

        if (!companyError && companyData) {
          console.log("Company data fetched:", companyData);
          const profileWithCompany = {
            ...userData,
            company: companyData,
          };

          // Cache the profile
          userProfileCache.set(userId, profileWithCompany);
          setUserProfile(profileWithCompany);
          pendingFetches.delete(userId);
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
      pendingFetches.delete(userId);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
      pendingFetches.delete(userId);
    }
  };

  useEffect(() => {
    // Only log initialization once per instance
    if (!isInstanceInitialized.current) {
      console.log("useAuth hook initialized");
      isInstanceInitialized.current = true;
    }

    // Skip initialization if already done globally
    if (isInitialized) {
      console.log(
        "useAuth already initialized, skipping duplicate initialization",
      );
      return () => {};
    }

    // Mark as initialized globally
    isInitialized = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        console.log(
          "Session data:",
          data.session ? "Session exists" : "No session",
        );
        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        } else {
          console.log("No user in session");
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
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("User in auth change:", session.user.email);
          await fetchUserProfile(session.user.id);
        } else {
          console.log("No user in auth change");
          setUserProfile(null);
        }

        setLoading(false);
      },
    );

    return () => {
      console.log("Cleaning up auth listener");
      authListener?.subscription.unsubscribe();
      // Don't reset isInitialized here, as we want to keep the singleton state
    };
  }, []);

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

      // Reset initialization state
      isInitialized = false;

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
