"use client";

import { useState, useEffect, Fragment } from "react";
import { getContacts, deleteContact } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2 } from "lucide-react";

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

  // Load viewed contacts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("viewed_contacts");
    if (stored) {
      setViewedContacts(JSON.parse(stored));
    }
  }, []);

  // Fetch contacts
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

  // Handle row click to mark as viewed
  const handleRowClick = (id: number, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".delete-button") || showDeleteModal) return;
    if (viewedContacts[id]) return;
    const updated = { ...viewedContacts, [id]: true };
    setViewedContacts(updated);
    localStorage.setItem("viewed_contacts", JSON.stringify(updated));
  };

  // Handle delete
  const handleDelete = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      await deleteContact(contactToDelete.id);
      setContacts(contacts.filter((contact) => contact.id !== contactToDelete.id));
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
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
      ) : contacts.length === 0 ? (
        <p className="text-gray-600">No contacts found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={(e) => handleRowClick(contact.id, e)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        viewedContacts[contact.id]
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {viewedContacts[contact.id] ? "Viewed" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.Company_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.services}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${contact.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setContactToDelete(contact);
                        setShowDeleteModal(true);
                      }}
                      className="delete-button text-red-600 hover:text-red-800"
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
                  Are you sure you want to delete the contact{" "}
                  <span className="font-semibold">{contactToDelete?.name}</span>? This action cannot be undone.
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
