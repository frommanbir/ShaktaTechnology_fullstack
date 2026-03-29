"use client";

import { useState, useEffect, Fragment } from "react";
import { getContacts, deleteContact } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2, Eye } from "lucide-react";
import { TableSkeleton, TableEmptyState } from "@/components/ui/table-skeleton";
import { Pagination } from "@/components/ui/pagination";

interface Contact {
  id: number;
  Company_name: string;
  email: string;
  phone?: string;
  name: string;
  services: string;
  budget: number;
  project_details: string;
  created_at: string;
}

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [viewedContacts, setViewedContacts] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [contactToView, setContactToView] = useState<Contact | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = localStorage.getItem("viewed_contacts");
    if (stored) {
      setViewedContacts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      try {
        const response = await getContacts();
        const newContacts = (response.data || []).sort(
          (a: Contact, b: Contact) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setContacts(newContacts);
        localStorage.setItem("last_contact_count", newContacts.length.toString());
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch contacts");
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (id: number, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".delete-button") || showDeleteModal) return;
    if ((event.target as HTMLElement).closest(".view-button") || showViewModal) return;
    if (viewedContacts[id]) return;
    const updated = { ...viewedContacts, [id]: true };
    setViewedContacts(updated);
    localStorage.setItem("viewed_contacts", JSON.stringify(updated));
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      await deleteContact(contactToDelete.id);
      
      const newContacts = contacts.filter((c) => c.id !== contactToDelete.id);
      setContacts(newContacts);
      
      const newTotalPages = Math.ceil(newContacts.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }

      const updatedViewed = { ...viewedContacts };
      delete updatedViewed[contactToDelete.id];
      setViewedContacts(updatedViewed);
      localStorage.setItem("viewed_contacts", JSON.stringify(updatedViewed));
      setShowDeleteModal(false);
      setContactToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete contact");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Contacts</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto transition-colors duration-300">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[
                "S.N",
                "Status",
                "Company Name",
                "Name",
                "Email",
                "Services",
                "Budget",
                "Actions",
              ].map((header, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${header === "Actions" ? "text-right" : "text-gray-500 dark:text-gray-300"
                    }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <TableSkeleton rows={5} columns={7} showActions={true} />
            ) : contacts.length === 0 ? (
              <TableEmptyState message="No contacts found." colSpan={8} />
            ) : (
              paginatedContacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  onClick={(e) => handleRowClick(contact.id, e)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${viewedContacts[contact.id]
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                    >
                      {viewedContacts[contact.id] ? "Viewed" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100 truncate max-w-[150px]" title={contact.Company_name}>
                    {contact.Company_name}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100 truncate max-w-[150px]" title={contact.name}>
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100 truncate max-w-[200px]" title={contact.email}>
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100 truncate max-w-[200px]" title={contact.services}>
                    {contact.services}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
                    ${contact.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContactToView(contact);
                        setShowViewModal(true);
                        // Also mark as viewed if clicking view directly
                        if (!viewedContacts[contact.id]) {
                          const updated = { ...viewedContacts, [contact.id]: true };
                          setViewedContacts(updated);
                          localStorage.setItem("viewed_contacts", JSON.stringify(updated));
                        }
                      }}
                      className="view-button text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      <Eye className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContactToDelete(contact);
                        setShowDeleteModal(true);
                      }}
                      className="delete-button text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

      {!loading && contacts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={contacts.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* View Contact Modal */}
      <Transition show={showViewModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowViewModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 bg-opacity-75" />
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
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                  <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Contact Details
                  </Dialog.Title>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                {contactToView && (
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Company Name</p>
                        <p className="font-medium text-lg leading-tight">{contactToView.Company_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Contact Name</p>
                        <p className="font-medium text-lg leading-tight">{contactToView.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</p>
                        <p className="font-medium">{contactToView.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                        <p className="font-medium">{contactToView.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Services Required</p>
                        <p className="font-medium">{contactToView.services}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Estimated Budget</p>
                        <p className="font-medium">${contactToView.budget}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date Submitted</p>
                        <p className="font-medium">{new Date(contactToView.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Project Details</p>
                      <div className="bg-gray-50 dark:bg-gray-900 pr-4 py-4 rounded-md whitespace-pre-wrap text-sm leading-relaxed min-h-[100px] border dark:border-gray-700 pl-4">
                        {contactToView.project_details || "No specific project details were provided."}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm font-medium cursor-pointer"
                  >
                    Close Dialog
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

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
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the contact{" "}
                  <span className="font-semibold">{contactToDelete?.name}</span>? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 flex items-center disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Contact"}
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
