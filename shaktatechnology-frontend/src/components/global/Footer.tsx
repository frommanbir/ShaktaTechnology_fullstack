"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Eye,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackVisit, getSettings } from "@/lib/api";

const SOCIAL_ICONS: Record<string, any> = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
};

export default function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Only increment once per browser session (not per refresh)
      const sessionKey = "shakta_visit_tracked";
      const visited = sessionStorage.getItem(sessionKey);

      if (!visited) {
        await trackVisit(window.location.pathname);
        sessionStorage.setItem(sessionKey, "true");
      }

      const data = await getSettings();
      setSettings(data);
      setVisitCount(Number(data.visits) || 0);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  fetchData();
}, []);

  // Scroll listener for "back to top" button
  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 border-t border-purple-200 dark:border-purple-700/40 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <motion.h2 whileHover={{ scale: 1.05 }} className="text-xl font-bold cursor-default">
              <span className="text-purple-600 dark:text-purple-400">Shakta</span>
              <span className="text-gray-900 dark:text-white">Technology</span>
            </motion.h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Empowering businesses with cutting-edge software solutions and digital transformation services.
            </p>

            {/* Dynamic Social Links */}
            <div className="flex space-x-4 mt-4 text-gray-600 dark:text-gray-400">
              {Object.entries(SOCIAL_ICONS).map(([key, Icon]) => {
                const url = settings[key];
                if (!url) return null;
                return (
                  <motion.a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                  >
                    <Icon size={22} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Navigation</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              {["services", "projects", "about", "careers", "faqs"].map((link) => (
                <motion.li key={link} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a
                    href={`/${link}`}
                    className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Services</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              {["Web Development", "Mobile Apps", "Cloud Solutions", "Digital Transformation"].map((service) => (
                <motion.li key={service} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a href="/services" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Info</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-purple-500 dark:text-purple-400" />
                info@shaktatechnology.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-purple-500 dark:text-purple-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} className="text-purple-500 dark:text-purple-400" />
                Kuleshwor, Kathmandu, Nepal
              </li>
            </ul>

            <div className="mt-3 flex items-center text-purple-600 dark:text-purple-400">
              <Eye size={16} className="mr-1" />
              <span className="text-lg">{visitCount !== null ? `${visitCount} visits` : "Loading..."}</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-200 dark:border-purple-700/40 text-center py-4 text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center justify-center transition-colors duration-300">
          <p>© 2024 ShaktaTechnology. All rights reserved.</p>
        </div>
      </motion.footer>

      {/* Floating Back to Top Button */}
      {showButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 bg-purple-600 dark:bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 dark:hover:bg-purple-400 transition duration-300 flex items-center justify-center z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </>
  );
}
