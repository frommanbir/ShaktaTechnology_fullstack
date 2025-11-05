"use client";

import { useState, useEffect, Fragment } from "react";
import { getSettings, createSettings, updateSettings, deleteSettings } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    phone: "",
    email: "",
    address: "",
    logo: null as File | null,
    website: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
    about: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/storage/";

  useEffect(() => {
    setError("");
    async function fetchSettings() {
      setLoading(true);
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
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let newSettings: Setting;
      if (settings) {
        const response = await updateSettings(settings.id, formData);
        newSettings = response.data;
        setSettings(newSettings);
      } else {
        const response = await createSettings(formData);
        newSettings = response.data;
        setSettings(newSettings);
      }
      setIsEditing(false);
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
      });
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
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                disabled={!isEditing && settings !== null}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                disabled={!isEditing && settings !== null}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                disabled={!isEditing && settings !== null}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                disabled={!isEditing && settings !== null}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={!isEditing && settings !== null}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={!isEditing && settings !== null}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={4}
                disabled={!isEditing && settings !== null}
              />
            </div>

            {/* Logo */}
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Logo</label>
              <div className="space-y-2">
                {settings?.logo && (
                  <div className="mb-2">
                    <Image
                      src={`${storageUrl}${settings.logo}`}
                      alt="Current Company Logo"
                      width={100}
                      height={100}
                      className="object-contain border rounded dark:invert dark:brightness-200"
                    />
                    {isEditing && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current logo (replace below if needed)
                      </p>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  accept="image/*"
                  disabled={!isEditing && settings !== null}
                />
                {formData.logo && isEditing && (
                  <p className="text-sm text-green-600 dark:text-green-400">New logo selected</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {settings && !isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      company_name: settings?.company_name || "",
                      phone: settings?.phone || "",
                      email: settings?.email || "",
                      address: settings?.address || "",
                      logo: null,
                      website: settings?.website || "",
                      linkedin: settings?.linkedin || "",
                      instagram: settings?.instagram || "",
                      facebook: settings?.facebook || "",
                      twitter: settings?.twitter || "",
                      about: settings?.about || "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />
                      Saving...
                    </>
                  ) : settings ? (
                    "Update Settings"
                  ) : (
                    "Create Settings"
                  )}
                </button>
              </>
            )}
          </div>
        </form>
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
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the settings for {settings?.company_name}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin h-4 w-4 inline" />
                    ) : (
                      "Delete"
                    )}
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
