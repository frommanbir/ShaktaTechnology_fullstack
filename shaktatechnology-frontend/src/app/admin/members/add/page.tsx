"use client";

import { useState } from "react";
import { createMember } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

export default function AddMemberPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "",
    experience: "",
    projects_involved: "",
    about: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    github: "",
    address: "",
    short_description: "",
    training: "",
    education: "",
    reference: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle text / textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as any);
      });

      await createMember(data);
      router.push("/admin/members");
    } catch (err: any) {
      console.error("Error:", err.response?.data);
      setError(
        err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : err.response?.data?.message || "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Add New Member
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Required fields */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Dynamic input fields */}
          {[
            "phone",
            "department",
            "position",
            "role",
            "experience",
            "projects_involved",
            "linkedin",
            "facebook",
            "instagram",
            "github",
            "address",
            "training",
            "education",
            "reference",
          ].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type="text"
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}

          {/* About */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Short Description
            </label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Profile Image
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <Upload className="w-5 h-5 text-gray-500" />
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                  Image Preview:
                </p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-md border dark:border-gray-700 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
