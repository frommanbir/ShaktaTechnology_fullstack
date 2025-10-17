'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Careers', href: '/admin/careers' },
  { name: 'Contacts', href: '/admin/contact' },
  { name: 'FAQs', href: '/admin/faqs' },
  { name: 'Members', href: '/admin/members' },
  { name: 'Projects', href: '/admin/project' },
  { name: 'Services', href: '/admin/services  ' },
  { name: 'Gallery', href: '/admin/gallery' },
  { name: 'News', href: '/admin/news' },
  { name: 'Testimonials', href: '/admin/testimonials' },
  { name: 'Settings', href: '/admin/setting' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col justify-between">
      {/* Navigation */}
      <div>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold font-poppins">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'block px-4 py-2 rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}