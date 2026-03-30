"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { getTestimonials, deleteTestimonial } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { Loader2, Trash2, Edit, Eye, User, MessageSquare } from "lucide-react";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import SearchBar from "@/components/SearchBar";
import { useToast } from "@/components/Toast";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      const sortedTestimonials = (data || []).sort(
        (a: Testimonial, b: Testimonial) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      setTestimonials(sortedTestimonials);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch testimonials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(testimonialToDelete.id);
      const updatedTestimonials = testimonials.filter((t) => t.id !== testimonialToDelete.id);
      setTestimonials(updatedTestimonials);

      const newFilteredTestimonials = updatedTestimonials.filter(
        (testimonial) =>
          testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testimonial.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testimonial.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const newTotalPages = Math.ceil(newFilteredTestimonials.length / itemsPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }

      setShowDeleteModal(false);
      setTestimonialToDelete(null);
      toast({ title: "Success", description: "Testimonial deleted successfully." });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete testimonial");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Client Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Manage and display feedback from your satisfied clients.</p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search LEFT */}
          <div className="w-[250px]">
            <SearchBar onSearch={handleSearch} placeholder="Search testimonials..." />
          </div>

          {/* Button RIGHT */}
          <Link
            href="/admin/testimonials/add"
            className="px-4 py-2 bg-blue-600 text-white flex items-center gap-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
          >
            + Add Testimonial
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  S.N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Testimonial
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <TableSkeleton rows={itemsPerPage} columns={5} showImage={true} />
              ) : filteredTestimonials.length === 0 ? (
                <TableEmptyState
                  message={
                    <>
                      No testimonials found.{" "}
                      <Link href="/admin/testimonials/add" className="text-blue-600 hover:underline">
                        Add the first one
                      </Link>
                    </>
                  }
                  colSpan={6}
                />
              ) : (
                paginatedTestimonials.map((testimonial, index) => (
                  <tr key={testimonial.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-10 h-10">
                        <Image
                          src={getImageUrl(testimonial.image_url || testimonial.image)}
                          alt={testimonial.name}
                          fill
                          sizes="40px"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      <p
                        className="cursor-pointer hover:underline"
                        onClick={() => setSelectedTestimonial(testimonial)}
                      >
                        {testimonial.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </td>
                    <td className="px-6 py-4 max-w-xs text-sm text-gray-700 dark:text-gray-200">
                      <p
                        className="line-clamp-2 cursor-pointer hover:underline"
                        onClick={() => setSelectedTestimonial(testimonial)}
                      >
                        {testimonial.text}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/view`}
                          className="p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setTestimonialToDelete(testimonial);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filteredTestimonials.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTestimonials.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Testimonial Detail Preview Modal */}
      <Transition show={selectedTestimonial !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedTestimonial(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-colors duration-300">
                <div className="flex items-start justify-between mb-4">
                  <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100 pr-4">
                    Testimonial Detail
                  </Dialog.Title>
                  <button
                    onClick={() => setSelectedTestimonial(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="items-center flex gap-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={getImageUrl(selectedTestimonial?.image_url || selectedTestimonial?.image || '')}
                        alt={selectedTestimonial?.name || ''}
                        fill
                        sizes="64px"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">{selectedTestimonial?.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedTestimonial?.role}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Testimonial</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">"{selectedTestimonial?.text}"</p>
                  </div>
                </div>
                <div className="flex justify-end mt-6 gap-3">
                  <Link
                    href={`/admin/testimonials/${selectedTestimonial?.id}/edit`}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setSelectedTestimonial(null)}
                    className="px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={showDeleteModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowDeleteModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 transition-colors duration-300">
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete the testimonial by{" "}
                  <span className="font-semibold">{testimonialToDelete?.name}</span>?{" "}
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 flex items-center disabled:opacity-50 transition"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Testimonial"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
