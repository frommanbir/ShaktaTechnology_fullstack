'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Careers', href: '/admin/careers' },
  { name: 'Contacts', href: '/admin/contact' },
  { name: 'FAQs', href: '/admin/faqs' },
  { name: 'Members', href: '/admin/members' },
  { name: 'Projects', href: '/admin/project' },
  { name: 'Services', href: '/admin/services' },
  { name: 'Gallery', href: '/admin/gallery' },
  { name: 'News', href: '/admin/news' },
  { name: 'Testimonials', href: '/admin/testimonials' },
  { name: 'Settings', href: '/admin/setting' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-xl font-bold font-poppins">Shakta Admin</h1>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'block px-4 py-2 rounded-md transition-colors duration-200 font-medium',
                  pathname === item.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="text-xs text-center text-gray-500 p-4 border-t border-gray-800 font-poppins">
        © {new Date().getFullYear()} Shakta Tech
      </div>
    </aside>
  );
}
