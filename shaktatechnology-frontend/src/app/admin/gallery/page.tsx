"use client";

import { useEffect, useState } from "react";
import { getGalleries, deleteGallery } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
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
      setGalleries(galleries.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Failed to delete gallery:", error);
      alert("Failed to delete gallery.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <Link
            href="/admin/gallery/add"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Gallery
          </Link>
        </div>

        {galleries.length === 0 ? (
          <p className="text-gray-500 text-center">No gallery items available.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
                  <th className="px-6 py-3 border-b">#</th>
                  <th className="px-6 py-3 border-b">Image</th>
                  <th className="px-6 py-3 border-b">Title</th>
                  <th className="px-6 py-3 border-b">Description</th>
                  <th className="px-6 py-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleries.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 border-b text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 border-b">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={60}
                          className="rounded-md object-cover border"
                        />
                      ) : (
                        <div className="w-20 h-14 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 border-b text-gray-600">
                      {item.description || "-"}
                    </td>
                    <td className="px-6 py-4 border-b text-right space-x-2">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="inline-flex items-center p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
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
