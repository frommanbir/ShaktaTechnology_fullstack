"use client";

import { useState, useEffect, Fragment } from "react";
import { getFaqs, deleteFaq } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Toast";

interface Faq {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
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
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  const handleDelete = async () => {
    if (!faqToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFaq(faqToDelete.id);
      setFaqs(faqs.filter((faq) => faq.id !== faqToDelete.id));
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <Link
          href="/admin/faqs/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add FAQ
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-gray-600">No FAQs found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Scrollable container */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td className="px-6 py-4 break-words max-w-xs">{faq.question}</td>
                    <td className="px-6 py-4 break-words max-w-xs">{faq.answer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                      <Link
                        href={`/admin/faqs/${faq.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => {
                          setFaqToDelete(faq);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
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
              <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the FAQ{" "}
                  <span className="font-semibold">{faqToDelete?.question}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-50"
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
