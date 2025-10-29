'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

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
    <header className="fixed top-0 left-64 right-0 z-20 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold font-poppins text-gray-800">
          Admin Dashboard
        </h2>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-gray-600 font-poppins">
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-all font-poppins"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
