"use client";

import { useState, useEffect, Fragment } from "react";
import { getSettings, createSettings, updateSettings, deleteSettings } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface Setting {
  id: number;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  logo?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  about?: string;
  visits?: number;
}

interface FormDataType {
  company_name: string;
  phone: string;
  email: string;
  address: string;
  logo: File | null;
  website: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  about: string;
  visits: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    company_name: "",
    phone: "",
    email: "",
    address: "",
    logo: null,
    website: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
    about: "",
    visits: 0,
  });

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/storage/";

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getSettings();
        setSettings(data);
        setFormData({
          company_name: data.company_name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          logo: null,
          website: data.website || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          about: data.about || "",
          visits: Number(data.visits ?? 0),
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "visits" ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      logo: e.target.files?.[0] ?? null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let newSettings: Setting;
      if (settings) {
        const res = await updateSettings(settings.id, formData);
        newSettings = res.data;
        setSettings(newSettings);
      } else {
        const res = await createSettings(formData);
        newSettings = res.data;
        setSettings(newSettings);
      }

      setFormData({
        company_name: newSettings.company_name || "",
        phone: newSettings.phone || "",
        email: newSettings.email || "",
        address: newSettings.address || "",
        logo: null,
        website: newSettings.website || "",
        linkedin: newSettings.linkedin || "",
        instagram: newSettings.instagram || "",
        facebook: newSettings.facebook || "",
        twitter: newSettings.twitter || "",
        about: newSettings.about || "",
        visits: newSettings.visits || 0,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!settings) return;
    setIsDeleting(true);
    try {
      await deleteSettings(settings.id);
      setSettings(null);
      setFormData({
        company_name: "",
        phone: "",
        email: "",
        address: "",
        logo: null,
        website: "",
        linkedin: "",
        instagram: "",
        facebook: "",
        twitter: "",
        about: "",
        visits: 0,
      });
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete settings");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Settings</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Social Links */}
            {["linkedin", "instagram", "facebook", "twitter"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 capitalize">{field}</label>
                <input
                  type="url"
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  placeholder={`https://www.${field}.com/yourprofile`}
                  disabled={!isEditing && settings !== null}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                />
              </div>
            ))}

            {/* About */}
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Visits */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Visits</label>
              <input
                type="number"
                name="visits"
                value={formData.visits ?? 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Logo */}
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Logo</label>
              {settings?.logo && (
                <Image
                  src={`${settings.logo}`}
                  alt="Current Logo"
                  width={100}
                  height={100}
                  className="object-contain border rounded dark:invert dark:brightness-200 mb-2"
                />
              )}
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!isEditing && settings !== null}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {settings && !isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Edit
                </button>
                <button type="button" onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-md">
                  Delete
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  {loading ? "Saving..." : settings ? "Update Settings" : "Create Settings"}
                </button>
              </>
            )}
          </div>
        </form>
      )}

      {/* Delete Modal */}
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
                  Are you sure you want to delete {settings?.company_name}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
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
