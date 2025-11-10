"use client";

import { useState, useEffect, Fragment } from "react";
import { getServices, deleteService } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Toast";

interface Service {
  id: number;
  title: string;
  // price?: string;
  description: string;
  features?: string[];
  technologies?: string[];
  created_at?: string;
}

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError("");
      try {
        const response = await getServices();
        if (response.success) {
          const sortedServices = (response.data || []).sort(
            (a: Service, b: Service) =>
              new Date(b.created_at || "1970-01-01").getTime() - new Date(a.created_at || "1970-01-01").getTime()
          );
          setServices(sortedServices);
        } else {
          setError("Failed to fetch services");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.id);
      setServices(services.filter((service) => service.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
      toast({ title: "Success", description: "Service deleted successfully." });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Services</h1>
        <Link
          href="/admin/services/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add Service
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      ) : services.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No services found.</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Title", "Description", "Features/Tech", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 break-words max-w-xs text-gray-900 dark:text-gray-100">{service.title}</td>
                    <td className="px-6 py-4 break-words max-w-md text-gray-800 dark:text-gray-200">{service.description || "N/A"}</td>
                    {/* <td className="px-6 py-4 break-words max-w-xs text-gray-800 dark:text-gray-200">{service.price || "N/A"}</td> */}
                    <td className="px-6 py-4 break-words max-w-xs text-sm text-gray-700 dark:text-gray-300">
                      {(service.features?.slice(0, 2).join(", ") || "") +
                        (service.technologies?.length ? ` | ${service.technologies.slice(0, 2).join(", ")}` : "") ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => {
                          setServiceToDelete(service);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
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
              <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the service{" "}
                  <span className="font-semibold">{serviceToDelete?.title}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 flex items-center disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Service"}
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
