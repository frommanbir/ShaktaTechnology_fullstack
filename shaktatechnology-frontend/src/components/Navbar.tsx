'use client';

import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = async () => {
    await apiClient.logout();
    router.push('/login');
  };

  return (
    <div className="bg-white shadow-sm border-b fixed top-0 right-0 left-64 z-10">
      <div className="flex justify-between items-center px-6 h-16">
        <div className="flex-1">
          <h2 className="text-xl font-semibold font-poppins">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          {userEmail && (
            <span className="text-sm text-gray-600">{userEmail}</span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-poppins"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}