"use client";

import { useEffect, useState } from "react";
import { getGalleries, deleteGallery } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all galleries
  const fetchGalleries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGalleries();
      setGalleries(data);
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
      setError("Failed to load galleries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Delete a gallery
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;
    setDeletingId(id);
    try {
      await deleteGallery(id);
      setGalleries((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Failed to delete gallery:", error);
      setError("Failed to delete gallery. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Show loader while fetching
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gallery Management
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={fetchGalleries}
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <Link
              href="/admin/gallery/add"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Gallery
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        {galleries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-10 text-center text-gray-500 dark:text-gray-400">
            <p>No gallery items available.</p>
            <Link
              href="/admin/gallery/add"
              className="inline-block mt-4 text-indigo-600 hover:underline"
            >
              Add your first gallery item →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200 uppercase text-sm">
                  <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                    #
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                    Image
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                    Title
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                    Description
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {galleries.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                      {item.image ? (
                        <Image
                          src={item.image?.startsWith("https") ? item.image : `/${item.image}`}
                          alt={item.title}
                          width={80}
                          height={60}
                          className="rounded-md object-cover border border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm rounded-md">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                      {item.description || "-"}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-right space-x-2">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="inline-flex items-center p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
