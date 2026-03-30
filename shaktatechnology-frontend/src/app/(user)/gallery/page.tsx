"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGalleries } from "@/lib/api";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import Heading from "@/components/global/Heading";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image?: string;
  images?: string[];
}

// Skeleton loader component for gallery items
const GallerySkeleton = () => (
  <div className="relative group overflow-hidden rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700" />
    <div className="absolute bottom-3 left-3 bg-gray-400 dark:bg-gray-600 h-8 w-24 rounded-lg" />
  </div>
);

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";

  const resolveUrl = useMemo(
    () => (url: string) => (url.startsWith("http") ? url : `${storageUrl}/storage/${url}`),
    [storageUrl]
  );

  const openGalleryModal = (item: Gallery) => {
    setSelectedGallery(item);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeGalleryModal = () => {
    setSelectedGallery(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = "";
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
      setCurrentImageIndex(
        (prev) => (prev - 1 + selectedGallery.images!.length) % selectedGallery.images!.length
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGallery) return;
      
      if (e.key === "ArrowLeft") {
        prevImage(e as any);
      } else if (e.key === "ArrowRight") {
        nextImage(e as any);
      } else if (e.key === "Escape") {
        closeGalleryModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGallery, currentImageIndex]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const data = await getGalleries();
        setGalleries(data);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
      } finally {
        setLoading(false);
        // Small delay to ensure smooth transition
        setTimeout(() => setImagesLoaded(true), 100);
      }
    };
    
    fetchGalleries();
  }, []);

  // Always show skeleton for first 500ms minimum to prevent flash
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  useEffect(() => {
    // Ensure skeleton shows for at least 300ms for smooth transition
    const timer = setTimeout(() => {
      if (!loading) {
        setShowSkeleton(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className="font-poppins min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Heading section - always visible immediately */}
      <Heading
        title={
          <>
            Our<span className="text-blue-600"> Gallery</span>
          </>
        }
        desc="Explore our visual journey through innovative projects, creative solutions, and memorable moments"
      />

      <div className="py-4 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Always show something - never blank */}
          {showSkeleton || loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              {[...Array(6)].map((_, i) => (
                <GallerySkeleton key={i} />
              ))}
            </motion.div>
          ) : galleries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No galleries available at the moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              {galleries.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                  onClick={() => openGalleryModal(item)}
                  className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {item.images && item.images.length > 0 ? (
                    <>
                      <div className="relative w-full h-64 overflow-hidden">
                        <Image
                          src={resolveUrl(item.images[0])}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={index < 3}
                          onLoad={() => {
                            // Optional: Track image loading
                          }}
                        />
                      </div>
                      {item.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                          {item.images.length}+
                        </div>
                      )}
                    </>
                  ) : item.image ? (
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={resolveUrl(item.image)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={index < 3}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-sm font-semibold line-clamp-1">
                      {item.title || "Untitled"}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGalleryModal}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/30 hover:bg-black/50 p-2 rounded-full z-10"
              onClick={closeGalleryModal}
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="absolute top-6 left-6 right-6 z-10 text-white text-center bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm max-w-md mx-auto">
              <h3 className="text-xl font-bold truncate">{selectedGallery.title}</h3>
              {selectedGallery.description && (
                <p
                  className="text-sm text-gray-300 mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: selectedGallery.description }}
                />
              )}
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative max-w-7xl w-full px-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedGallery.images && selectedGallery.images.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 md:left-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="relative w-full h-[70vh] md:h-[80vh]">
                {selectedGallery.images && selectedGallery.images.length > 0 ? (
                  <Image
                    src={resolveUrl(selectedGallery.images[currentImageIndex])}
                    alt={selectedGallery.title}
                    fill
                    className="rounded-lg object-contain"
                    priority
                    sizes="90vw"
                  />
                ) : selectedGallery.image ? (
                  <Image
                    src={resolveUrl(selectedGallery.image)}
                    alt={selectedGallery.title}
                    fill
                    className="rounded-lg object-contain"
                    priority
                    sizes="90vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    No image available
                  </div>
                )}
              </div>

              {selectedGallery.images && selectedGallery.images.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 md:right-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </motion.div>

            {selectedGallery.images && selectedGallery.images.length > 1 && (
              <div className="mt-6 flex items-center gap-2 overflow-x-auto px-4 max-w-full pb-2 scrollbar-thin">
                {selectedGallery.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-violet-500 scale-105 opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  >
                    <Image
                      src={resolveUrl(img)}
                      alt={`${selectedGallery.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
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