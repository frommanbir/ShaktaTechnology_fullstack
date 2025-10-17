"use client";

import { useEffect, useState } from "react";
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

  // Centralized storage URL
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {galleries.length === 0 ? (
          <p className="text-gray-500">No gallery items available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleries.map((item) => (
              <div
                key={item.id}
                onClick={() => item.image && setSelectedImage(item.image)}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-lg">
                  {item.title || "Untitled"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Modal for enlarged image --- */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full px-4">
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
          </div>
        </div>
      )}
    </div>
  );
}
