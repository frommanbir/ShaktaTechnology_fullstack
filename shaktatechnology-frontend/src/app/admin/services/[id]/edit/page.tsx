"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { getService, updateService } from "@/lib/api";
import Link from "next/link";

interface Service {
  id: number;
  title: string;
  description: string;
  price?: string;
  features: string[];
  technologies: string[];
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    features: [""],
    technologies: [""],
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await getService(id);
        setService(serviceData);
        
        setFormData({
          title: serviceData.title || "",
          description: serviceData.description || "",
          price: serviceData.price || "",
          features: serviceData.features.length > 0 ? serviceData.features : [""],
          technologies: serviceData.technologies.length > 0 ? serviceData.technologies : [""],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load service.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

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
    setUpdating(true);
    setError(null);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        price: formData.price || undefined,
        features: formData.features.filter(item => item.trim() !== ""),
        technologies: formData.technologies.filter(item => item.trim() !== ""),
      };

      const result = await updateService(id, submitData);
      if (result.success) router.push("/admin/services");
      else setError(result.message || "Failed to update service");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20 text-slate-600 dark:text-slate-300">Loading service...</div>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="py-20 text-red-500 dark:text-red-400">{error}</div>
          <Link href="/admin/services" className="text-indigo-500 hover:text-indigo-600 font-medium">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/services"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Edit Service</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Update service details</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Web Development"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                placeholder="Describe the service in detail..."
              />
            </div>

            {/* Price */}
            {/* <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., $999, Contact for pricing"
              />
            </div> */}

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Features
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="text-indigo-500 hover:text-indigo-600 text-sm font-medium flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'features')}
                      disabled={formData.features.length === 1}
                      className="p-3 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Technologies
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('technologies')}
                  className="text-indigo-500 hover:text-indigo-600 text-sm font-medium flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Technology
                </button>
              </div>
              <div className="space-y-2">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Technology ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'technologies')}
                      disabled={formData.technologies.length === 1}
                      className="p-3 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link
                href="/admin/services"
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updating}
                className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
