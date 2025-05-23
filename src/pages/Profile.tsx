import React from "react";
import UserProfile from "@/components/auth/UserProfile";
import Sidebar from "@/components/layout/Sidebar";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        </div>
        <UserProfile />
      </main>
    </div>
  );
};

export default Profile;
