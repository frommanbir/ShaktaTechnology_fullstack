'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type NavChild = { name: string; href: string };
type NavItem =
  | { name: string; href: string; children?: undefined }
  | { name: string; href: string; children: NavChild[] };

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin' },
  {
    name: 'Careers',
    href: '/admin/careers',
    children: [
      { name: 'Employment Types', href: '/admin/careers/types' },
    ],
  },
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

  // All groups start closed; user opens them manually
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-64 bg-[#3d2f28] border-r border-[#4a3b32] text-gray-200 h-screen fixed left-0 top-0 flex flex-col z-40 shadow-[4px_0_24px_-15px_rgba(0,0,0,0.1)]">
      <div className="h-16 border-b border-[#4a3b32] flex items-center px-6">
        <h1 className="text-xl font-bold font-poppins text-[#d4a373] tracking-tight">
          Shakta <span className="text-[#fdf8f6] font-extrabold">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 pt-6 overflow-y-auto space-y-6">
        <div>
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Main Management
          </p>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const hasChildren = !!item.children?.length;

              // Active detection for parent link
              const isParentActive = hasChildren
                ? pathname === item.href ||
                  (pathname.startsWith(item.href) &&
                    !item.children!.some((c) => pathname === c.href))
                : item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href;

              const isGroupOpen = openGroups[item.name] ?? false;

              return (
                <li key={item.name}>
                  {hasChildren ? (
                    <>
                      {/* Parent row — clickable for both navigation and toggle */}
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          className={cn(
                            'flex-1 flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm',
                            isParentActive
                              ? 'bg-[#8b5a2b] text-white shadow-lg shadow-[#8b5a2b]/20'
                              : 'text-[#c2b2a9] hover:bg-[#4a3b32] hover:text-white'
                          )}
                        >
                          {item.name}
                        </Link>
                        {/* Chevron toggle */}
                        <button
                          onClick={() => toggleGroup(item.name)}
                          className={cn(
                            'p-2 rounded-lg transition-all duration-200',
                            isParentActive
                              ? 'text-white hover:bg-[#a06d3d]'
                              : 'text-[#c2b2a9] hover:bg-[#4a3b32] hover:text-white'
                          )}
                          aria-label="Toggle submenu"
                        >
                          <ChevronDown
                            size={14}
                            className={cn(
                              'transition-transform duration-200',
                              isGroupOpen ? 'rotate-180' : 'rotate-0'
                            )}
                          />
                        </button>
                      </div>

                      {/* Children */}
                      <ul
                        className={cn(
                          'ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3 overflow-hidden transition-all duration-200',
                          isGroupOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                        )}
                      >
                        {item.children!.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={cn(
                                  'flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                                  isChildActive
                                    ? 'bg-[#8b5a2b]/20 text-[#d4a373]'
                                    : 'text-[#a89b94] hover:bg-[#4a3b32] hover:text-[#fdf8f6]'
                                )}
                              >
                                <span className="w-1 h-1 rounded-full bg-current mr-2 opacity-60" />
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm',
                        isParentActive
                          ? 'bg-[#8b5a2b] text-white shadow-lg shadow-[#8b5a2b]/20 active:scale-[0.98]'
                          : 'text-[#c2b2a9] hover:bg-[#4a3b32] hover:text-white'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-center text-[#a89b94] py-6 border-t border-[#4a3b32] bg-[#32251e]">
        © {new Date().getFullYear()} Shakta Tech
      </div>
    </aside>
  );
}
