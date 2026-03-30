"use client";

import { useEffect, useState } from "react";
import { getGalleries, deleteGallery } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image?: string;
  images?: string[];
}

export default function AdminGalleryListPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const router = useRouter();

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      const newGalleries = galleries.filter((g) => g.id !== id);
      setGalleries(newGalleries);

      const newTotalPages = Math.ceil(newGalleries.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Failed to delete gallery:", error);
      setError("Failed to delete gallery. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(galleries.length / itemsPerPage);
  const paginatedGalleries = galleries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gallery Management
          </h1>
          <div className="flex space-x-3">
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

        {/* Table container */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200 uppercase text-sm">
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">S.N</th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">Image</th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">Title</th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">Description</th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <TableSkeleton rows={itemsPerPage} columns={3} showImage={true} showActions={true} />
              ) : galleries.length === 0 ? (
                <TableEmptyState 
                  message={
                    <>
                      <p>No gallery items available.</p>
                      <Link href="/admin/gallery/add" className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">Add your first gallery item →</Link>
                    </>
                  } 
                  colSpan={5} 
                />
              ) : (
                paginatedGalleries.map((item, index) => (
                  <Fragment key={item.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border-b border-gray-100 dark:border-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        {(item.images && item.images.length > 0) || item.image ? (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={(item.images && item.images.length > 0 ? item.images[0] : item.image)?.startsWith("https") ? (item.images && item.images.length > 0 ? item.images[0] : item.image || "") : `/${(item.images && item.images.length > 0 ? item.images[0] : item.image)}`}
                              alt={item.title}
                              fill
                              className="object-cover"
                              loading="lazy"
                            />
                            {item.images && item.images.length > 1 && (
                              <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">
                                +{item.images.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase border border-gray-100 dark:border-gray-800">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 max-w-[200px]">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="line-clamp-2 max-w-[280px] text-sm text-gray-600 dark:text-gray-400 italic">
                          {stripHtml(item.description || "No description")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/gallery/${item.id}/view`}
                            className="p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/gallery/${item.id}/edit`}
                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit Item"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete Item"
                          >
                            {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {!loading && galleries.length > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={galleries.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
    </div>
  );
}
