"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-3 px-2 py-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200 dark:border-gray-700">
        <Sun className="h-4 w-4 text-gray-400" />
        <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <Moon className="h-4 w-4 text-gray-400" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-3 px-3 py-1.5 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 transition-all shadow-sm"
    >
      <motion.div
        animate={{ scale: isDark ? 0.8 : 1.1, rotate: isDark ? -10 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Sun
          className={`h-4 w-4 transition-colors ${!isDark ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-gray-400"}`}
        />
      </motion.div>

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-400"
      />

      <motion.div
        animate={{ scale: isDark ? 1.1 : 0.8, rotate: isDark ? 0 : 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Moon
          className={`h-4 w-4 transition-colors ${isDark ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-gray-400"}`}
        />
      </motion.div>
    </motion.div>
  );
}
