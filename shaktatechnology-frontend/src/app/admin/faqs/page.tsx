"use client";

import { useState, useEffect, Fragment } from "react";
import { getFaqs, deleteFaq } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import SearchBar from "@/components/SearchBar";

interface Faq {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

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
        setFilteredFaqs(sortedFaqs);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredFaqs(faqs);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredFaqs(
      faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(lower) ||
          faq.answer.toLowerCase().includes(lower)
      )
    );
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFaq(faqToDelete.id);
      const updatedFaqs = faqs.filter((faq) => faq.id !== faqToDelete.id);
      setFaqs(updatedFaqs);
      setFilteredFaqs(updatedFaqs);
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

        <div className="flex-1 min-w-[200px]">
          <SearchBar onSearch={handleSearch} placeholder="Search FAQs..." />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
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

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      ) : filteredFaqs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No FAQs found.</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden transition-colors duration-300">
          {/* Scrollable container */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
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
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id}>
                    <td className="px-6 py-4 break-words max-w-xs">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 break-words max-w-xs">
                      {faq.answer}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
