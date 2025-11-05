"use client";

import { useState, useEffect } from "react";
import { getCareer, updateCareer } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function EditCareerPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    benefits: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCareer() {
      setLoading(true);
      try {
        const data = await getCareer(Number(id));
        setFormData({
          title: data.title || "",
          department: data.department || "",
          location: data.location || "",
          type: data.type || "Full-time",
          description: data.description || "",
          requirements: data.requirements || "",
          benefits: data.benefits || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch career");
      } finally {
        setLoading(false);
      }
    }
    fetchCareer();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateCareer(Number(id), formData);
      router.push("/admin/careers");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update career");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Edit Career</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 dark:text-gray-100">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6 transition-colors duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                rows={4}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Requirements *</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                rows={4}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/admin/careers")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Career"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
