"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGalleries } from "@/lib/api";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const data = await getGalleries();
        setGalleries(data);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-12"
        >
          Our <span className="text-violet-600 dark:text-violet-400">Gallery</span>
        </motion.h2>

        {galleries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No gallery items available.
          </p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {galleries.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 30 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                onClick={() => item.image && setSelectedImage(item.image)}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    No Image
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-violet-600 dark:bg-violet-500 text-white text-sm font-medium px-3 py-1 rounded-lg">
                  {item.title || "Untitled"}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal for enlarged image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={selectedImage}
                alt="Enlarged"
                width={1000}
                height={800}
                className="w-full h-auto rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
