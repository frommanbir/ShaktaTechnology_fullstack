"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSettings } from "@/lib/api";
import ThemeToggle from "../ThemeToggle";
import { usePathname } from "next/navigation";

interface Setting {
  id: number;
  company_name: string;
  logo?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [settings, setSettings] = useState<Setting | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  const aboutSubLinks = [
    { name: "Overview", href: "/about#overview" },
    { name: "Mission & Vision", href: "/about#mission" },
    { name: "Our Impact", href: "/about#impact" },
    { name: "Core Values", href: "/about#values" },
    { name: "Meet the Team", href: "/about#team" },
    { name: "Our Story", href: "/about#story" },
  ];

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    }
    fetchSettings();
  }, []);

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isOpen) setIsOpen(false);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: showNavbar ? 0 : -80,
        opacity: showNavbar ? 1 : 0,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-28 h-10"
          >
            <Image
              src="/logo/shaktalogo.svg"
              alt={settings?.company_name || "Logo"}
              fill
              sizes="(max-width: 768px) 120px, (max-width: 1200px) 160px, 200px"
              className="object-contain transition-all duration-300 dark:brightness-0 dark:invert"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {/* About Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setAboutDropdownOpen(true)}
            onMouseLeave={() => setAboutDropdownOpen(false)}
          >
            <Link
              href="/about"
              className={`flex items-center gap-1 font-medium transition-colors py-2
                ${pathname.startsWith("/about") ? "text-purple-600 dark:text-purple-400" : "text-gray-900 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"}
              `}
            >
              About
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? "rotate-180" : ""}`} />
            </Link>

            <AnimatePresence>
              {aboutDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 min-w-[200px] overflow-hidden"
                >
                  {aboutSubLinks.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link
                href={link.href}
                className={`relative font-medium transition-colors
                  ${
                    pathname === link.href
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-900 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                  }
                `}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-gray-600 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-2">
              {/* About Mobile */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="flex items-center justify-between w-full py-2 text-gray-700 dark:text-gray-200 font-medium"
                >
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileAboutOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 space-y-1 overflow-hidden"
                    >
                      {aboutSubLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
