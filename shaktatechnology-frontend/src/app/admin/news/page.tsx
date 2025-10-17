"use client";

import { useEffect, useState } from "react";
import { getGalleries, deleteGallery } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

export default function AdminGalleryListPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";

  // ✅ Helper function to handle both relative and absolute image URLs
  const getImageUrl = (path?: string): string | null => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${storageUrl.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
  };

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;
    setDeletingId(id);
    try {
      await deleteGallery(id);
      setGalleries((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Failed to delete gallery:", error);
      alert("Failed to delete gallery.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gallery Management
          </h1>
          <Link
            href="/admin/gallery/add"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Gallery
          </Link>
        </div>

        {/* Empty state */}
        {galleries.length === 0 ? (
          <p className="text-gray-500 text-center">
            No gallery items available.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleries.map((item) => {
              const imageUrl = getImageUrl(item.image);
              return (
                <div
                  key={item.id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
