"use client";

import { useState, useEffect } from "react";
import { createProject } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import TextEditor from "@/components/global/TextEditor";
import { X, Save, ArrowLeft, Plus } from "lucide-react";
import Image from "next/image";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const submitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      client: formData.client,
      duration: formData.duration,
      technologies: [formData.technologies],
      key_results: [formData.key_results],
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
    <div className="p-6 max-w-7xl mx-auto transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Add Project</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6 transition-colors duration-300"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            maxLength={255}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

        {/* Client */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Client *
          </label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            maxLength={255}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Duration *
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            maxLength={100}
            placeholder="e.g., 6 months"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <TextEditor
            content={formData.description}
            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
            placeholder="Describe the project..."
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technologies
          </label>
          <TextEditor
            content={formData.technologies}
            onChange={(val) => setFormData(prev => ({ ...prev, technologies: val }))}
            placeholder="List technologies used..."
          />
        </div>

        {/* Key Results */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Key Results
          </label>
          <TextEditor
            content={formData.key_results}
            onChange={(val) => setFormData(prev => ({ ...prev, key_results: val }))}
            placeholder="Highlight key achievements..."
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Image
          </label>
          
          <div className="flex flex-col gap-4">
            {previewUrl ? (
              <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
                <p className="text-sm">No image selected</p>
              </div>
            )}
            
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              accept="image/*"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/project")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
