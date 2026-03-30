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
    <header className="fixed top-0 left-64 right-0 z-30 bg-background/80 backdrop-blur-md shadow-[0_4px_24px_-15px_rgba(0,0,0,0.1)] border-b border-border h-16 flex items-center px-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-lg font-bold font-poppins text-foreground tracking-tight">
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
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-all font-poppins shadow-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
