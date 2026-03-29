"use client";

import { useState, useEffect, Fragment } from "react";
import { getFaqs, deleteFaq } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import SearchBar from "@/components/SearchBar";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";

interface Faq {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      try {
        const response = await getFaqs();
        const sortedFaqs = (response.data || []).sort(
          (a: Faq, b: Faq) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setFaqs(sortedFaqs);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!faqToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFaq(faqToDelete.id);
      const updatedFaqs = faqs.filter((faq) => faq.id !== faqToDelete.id);
      setFaqs(updatedFaqs);

      // Re-calculate total pages for the NEW filtered list
      const newFilteredFaqs = updatedFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const newTotalPages = Math.ceil(newFilteredFaqs.length / itemsPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }

      setShowDeleteModal(false);
      setFaqToDelete(null);
      toast({ title: "Success", description: "FAQ deleted successfully." });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">FAQs</h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search LEFT */}
            <div className="w-[250px]">
            <SearchBar onSearch={handleSearch} placeholder="Search FAQs..." />
            </div>

            {/* Button RIGHT */}
            <Link
            href="/admin/faqs/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
            Add FAQ
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
        {/* Scrollable container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  S.N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Answer
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <TableSkeleton rows={itemsPerPage} columns={3} showActions={true} />
              ) : filteredFaqs.length === 0 ? (
                <TableEmptyState message="No FAQs found." colSpan={4} />
              ) : (
                paginatedFaqs.map((faq, index) => (
                  <tr key={faq.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                        <p
                            className="line-clamp-2 cursor-pointer hover:underline"
                            onClick={() => setSelectedFaq(faq)}
                        >
                            {faq.question}
                        </p>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                        <p
                            className="line-clamp-2 cursor-pointer hover:underline"
                            onClick={() => setSelectedFaq(faq)}
                        >
                            {faq.answer}
                        </p>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                      <Link
                        href={`/admin/faqs/${faq.id}/edit`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => {
                          setFaqToDelete(faq);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filteredFaqs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredFaqs.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* FAQ Detail Preview Modal */}
      <Transition show={selectedFaq !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedFaq(null)}>
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
                    FAQ Detail
                  </Dialog.Title>
                  <button
                    onClick={() => setSelectedFaq(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Question</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">{selectedFaq?.question}</p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Answer</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedFaq?.answer}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-6 gap-3">
                  <Link
                    href={`/admin/faqs/${selectedFaq?.id}/edit`}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setSelectedFaq(null)}
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
                  Are you sure you want to delete the FAQ{" "}
                  <span className="font-semibold">{faqToDelete?.question}</span>?{" "}
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
                    {isDeleting ? "Deleting..." : "Delete FAQ"}
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
