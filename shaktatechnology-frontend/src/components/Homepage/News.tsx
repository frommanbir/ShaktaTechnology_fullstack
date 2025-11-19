"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNews } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { News } from "@/components/types/news";
import { motion, useReducedMotion, easeOut } from "framer-motion";

export default function HomeNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await getNews();
        const data = response?.data || response || [];
        setNews(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  if (loading) {
    return (
      <section className="py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-500 dark:text-red-400">
        <p>{error}</p>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-16 text-center text-gray-600 dark:text-gray-400">
        <p>No news available right now.</p>
      </section>
    );
  }

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6 lg:px-8"
      aria-labelledby="latest-news"
    >
      {/* Animated Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="text-center"
      >
        <h2
          id="latest-news"
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white inline-block"
        >
          Latest{" "}
          <motion.span
            className="text-violet-600 dark:text-violet-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4, ease: easeOut }}
          >
            News & Insights
          </motion.span>
        </h2>
        <motion.p
          className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: easeOut }}
        >
          Stay updated with the latest updates and insights from our company.
        </motion.p>
      </motion.header>

      {/* Animated News Grid */}
      <motion.div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {news.slice(0, 3).map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: easeOut },
                  }
            }
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Image with hover zoom */}
            <div className="relative w-full h-52 sm:h-56 lg:h-64 overflow-hidden">
              {item.image ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: easeOut }}
                  className="w-full h-full"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                </motion.div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 text-left">
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white line-clamp-2">
                {item.title}
              </h3>

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {item.author && <span>By {item.author}</span>}
                {item.date && (
                  <span>
                    {" "}
                    •{" "}
                    {new Date(item.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm sm:text-base line-clamp-3">
                {item.description || "No description available."}
              </p>

              <div className="mt-5">
                <Link
                  href={`/news/${item.id}`}
                  className="text-violet-600 dark:text-violet-400 font-medium text-sm hover:underline inline-flex items-center gap-1"
                >
                  Read More
                  <motion.span
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated View All Button */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: easeOut }}
      >
        <Link href="/news" passHref>
          <motion.button
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                  }
            }
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-violet-600 dark:bg-violet-500 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300"
          >
            View All News
            <motion.span
              className="inline-block"
              animate={{ x: 0 }}
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              →
            </motion.span>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}