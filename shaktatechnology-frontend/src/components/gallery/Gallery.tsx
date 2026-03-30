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
  images?: string[];
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGalleryModal = (item: Gallery) => {
    setSelectedGallery(item);
    setCurrentImageIndex(0);
  };

  const closeGalleryModal = () => {
    setSelectedGallery(null);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedGallery?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.images!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedGallery?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedGallery.images!.length) % selectedGallery.images!.length);
    }
  };

  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";
    
  const resolveUrl = (url: string) => url.startsWith("http") ? url : `${storageUrl}/storage/${url}`;

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
                onClick={() => openGalleryModal(item)}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {item.images && item.images.length > 0 ? (
                  <>
                  <Image
                    src={resolveUrl(item.images[0])}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded">
                      1 / {item.images.length}
                    </div>
                  )}
                  </>
                ) : item.image ? (
                  <Image
                    src={resolveUrl(item.image)}
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

      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGalleryModal}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/30 p-2 rounded-full"
              onClick={closeGalleryModal}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="mb-4 text-white text-center">
              <h3 className="text-2xl font-bold">{selectedGallery.title}</h3>
              {selectedGallery.description && (
                <p className="text-sm text-gray-300 max-w-2xl mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: selectedGallery.description }}></p>
              )}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full px-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedGallery.images && selectedGallery.images.length > 1 && (
                <button 
                  onClick={prevImage}
                  className="absolute left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:flex"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
              )}
              
              <div className="relative w-full aspect-video md:aspect-[16/9] lg:h-[70vh]">
                <Image
                  src={resolveUrl(selectedGallery.images && selectedGallery.images.length > 0 ? selectedGallery.images[currentImageIndex] : (selectedGallery.image || ""))}
                  alt={selectedGallery.title}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>

              {selectedGallery.images && selectedGallery.images.length > 1 && (
                <button 
                  onClick={nextImage}
                  className="absolute right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:flex"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              )}
            </motion.div>
            
            {selectedGallery.images && selectedGallery.images.length > 1 && (
              <div className="mt-6 flex items-center gap-2 overflow-x-auto px-4 max-w-full pb-2 no-scrollbar">
                {selectedGallery.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${idx === currentImageIndex ? 'border-violet-500 scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={resolveUrl(img)} alt={`${selectedGallery.title} ${idx+1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
