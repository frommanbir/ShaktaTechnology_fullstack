"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { createService } from "@/lib/api";
import Link from "next/link";

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    features: [""],
    technologies: [""],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, field: 'features' | 'technologies') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'features' | 'technologies') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index: number, field: 'features' | 'technologies') => {
    if (formData[field].length === 1) return;
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        price: formData.price || undefined,
        features: formData.features.filter(item => item.trim() !== ""),
        technologies: formData.technologies.filter(item => item.trim() !== ""),
      };

      const result = await createService(submitData);

      if (result.success) router.push("/admin/services");
      else setError(result.message || "Failed to create service");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/services"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add New Service</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new service offering</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
                Service Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Web Development"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                placeholder="Describe the service in detail..."
              />
            </div>

            {/* Price */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="price">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., $999, Contact for pricing"
              />
            </div> */}

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="text-indigo-500 hover:text-indigo-600 text-sm font-medium flex items-center gap-1"
                >
                  <Plus size={16} /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'features')}
                      disabled={formData.features.length === 1}
                      className="p-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technologies</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('technologies')}
                  className="text-indigo-500 hover:text-indigo-600 text-sm font-medium flex items-center gap-1"
                >
                  <Plus size={16} /> Add Technology
                </button>
              </div>
              <div className="space-y-2">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Technology ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'technologies')}
                      disabled={formData.technologies.length === 1}
                      className="p-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/services"
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
