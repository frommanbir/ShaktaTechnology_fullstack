"use client";

import { useState, useEffect, Fragment } from "react";
import { getCareers, deleteCareer } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

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
  const [filteredCareers, setFilteredCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<Career | null>(null);

  useEffect(() => {
    async function fetchCareers() {
      setLoading(true);
      try {
        const careersData = await getCareers();
        setCareers(careersData);
        setFilteredCareers(careersData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch careers");
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  // 🔍 Search handler
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCareers(careers);
    } else {
      const lower = query.toLowerCase();
      setFilteredCareers(
        careers.filter(
          (career) =>
            career.title.toLowerCase().includes(lower) ||
            career.department?.toLowerCase().includes(lower) ||
            career.location?.toLowerCase().includes(lower) ||
            career.type.toLowerCase().includes(lower)
        )
      );
    }
  };

  // 🗑️ Delete logic
  const handleDelete = async () => {
    if (!careerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCareer(careerToDelete.id);
      const updated = careers.filter((c) => c.id !== careerToDelete.id);
      setCareers(updated);
      setFilteredCareers(updated);
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Careers</h1>

        <div className="flex-1 min-w-[200x]">
        <SearchBar onSearch={handleSearch} placeholder="Search careers..." />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link
            href="/admin/careers/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Career
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      ) : filteredCareers.length === 0 ? (
        <p className="text-gray-600 text-center">No careers found.</p>
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
              {filteredCareers.map((career) => (
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
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{careerToDelete?.title}</span>? This action cannot
                  be undone.
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
