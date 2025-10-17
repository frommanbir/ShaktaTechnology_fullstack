"use client";

import { useState, useEffect, Fragment } from "react";
import { getCareers, deleteCareer } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Career {
  id: number;
  title: string;
  department?: string;
  location?: string;
  type: string;
  description: string;
  requirements: string;
  benefits?: string;
}

export default function AdminCareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<Career | null>(null);

  useEffect(() => {
    async function fetchCareers() {
      setLoading(true);
      try {
        const careers = await getCareers(); // This is already the array
        setCareers(careers); // No need for `.data`
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch careers");
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);


  const handleDelete = async () => {
    if (!careerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCareer(careerToDelete.id);
      setCareers(careers.filter((career) => career.id !== careerToDelete.id));
      setShowDeleteModal(false);
      setCareerToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete career");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Careers</h1>
        <Link
          href="/admin/careers/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Career
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      ) : careers.length === 0 ? (
        <p className="text-gray-600">No careers found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {careers.map((career) => (
                <tr key={career.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{career.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{career.department || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{career.location || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{career.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/careers/${career.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </Link>
                    <button
                      onClick={() => {
                        setCareerToDelete(career);
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
      )}

      {/* Delete Confirmation Modal */}
      <Transition show={showDeleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteModal(false)}>
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
                  Are you sure you want to delete the career{" "}
                  <span className="font-semibold">{careerToDelete?.title}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
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
                    {isDeleting ? "Deleting..." : "Delete Career"}
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