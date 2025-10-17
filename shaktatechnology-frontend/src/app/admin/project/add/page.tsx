"use client";

import { useState } from "react";
import { createProject } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function AddProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    client: "",
    duration: "",
    technologies: "",
    key_results: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Web Development",
    "Mobile Development",
    "Cloud Solutions",
    "IoT Solutions",
    "Education Tech",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const technologies = formData.technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const keyResults = formData.key_results
      .split(",")
      .map((result) => result.trim())
      .filter((result) => result.length > 0);

    const submitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      client: formData.client,
      duration: formData.duration,
      technologies,
      key_results: keyResults,
      image: formData.image,
    };

    try {
      await createProject(submitData);
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      router.push("/admin/project");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Project</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Client *</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Duration *</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            maxLength={100}
            placeholder="e.g., 6 months"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Technologies (comma-separated)</label>
          <textarea
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            placeholder="e.g., React, Node.js, Tailwind CSS"
          />
          <p className="text-xs text-gray-500 mt-1">Enter technologies separated by commas.</p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Key Results (comma-separated)</label>
          <textarea
            name="key_results"
            value={formData.key_results}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            placeholder="e.g., Increased user engagement by 40%, Reduced load time by 2s"
          />
          <p className="text-xs text-gray-500 mt-1">Enter key results separated by commas.</p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Image (Optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/project")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}