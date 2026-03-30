"use client";

import { useState, useEffect, Fragment } from "react";
import { getServices, deleteService } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Edit, Eye, ChevronDown } from "lucide-react";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  S.N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Features/Tech
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <TableSkeleton rows={5} columns={4} />
              ) : services.length === 0 ? (
                <TableEmptyState 
                  message={
                    <>
                      No services found.{" "}
                      <Link href="/admin/services/add" className="text-blue-600 hover:underline">
                        Add the first one
                      </Link>
                    </>
                  } 
                  colSpan={5} 
                />
              ) : (
                paginatedServices.map((service, index) => (
                  <Fragment key={service.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border-b border-gray-100 dark:border-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 max-w-[200px]">{service.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 italic">
                        <div className="line-clamp-2 max-w-[300px]">
                          {stripHtml(service.description)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                          {stripHtml(service.features?.join(", ") || "No features")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/services/${service.id}/view`}
                            className="p-2 rounded-lg transition-all text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit Service"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setServiceToDelete(service);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>

      {!loading && services.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={services.length}
          itemsPerPage={itemsPerPage}
        />
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
              <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 transition-colors shadow-xl">
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
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 flex items-center disabled:opacity-50 transition-colors"
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
