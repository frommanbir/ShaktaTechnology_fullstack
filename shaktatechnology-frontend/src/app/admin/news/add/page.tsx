"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNews } from "@/lib/api";
import TextEditor from "@/components/global/TextEditor";
import { ArrowLeft, Loader2, Camera, X } from "lucide-react";

export default function AddNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    date: new Date().toISOString().split("T")[0],
    author: "",
    read_time: "",
    featured: false,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("category", formData.category || "");
      submitData.append("author", formData.author || "");
      submitData.append("read_time", formData.read_time || "");
      submitData.append("date", formData.date || "");
      submitData.append("featured", formData.featured ? "1" : "0");
      if (formData.image) submitData.append("image", formData.image);

      const response = await createNews(submitData);
      if (response.success) {
        router.push("/admin/news");
      } else {
        const messages = response.errors
          ? Object.values(response.errors).flat().join(", ")
          : "Failed to create news article";
        setError(messages);
      }
    } catch (err: any) {
      console.error("Error creating news:", err.response?.data || err);
      setError(
        err.response?.data?.message || "Failed to create news article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/news"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Newsroom
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-2xl text-purple-600 dark:text-purple-400">
                <Camera size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Publish Article</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Compose and publish a new article to the newsroom.</p>
             </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter news title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Database">Database</option>
                  <option value="Announcements">Announcements</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Author name"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="e.g., 5 min read"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Featured Article
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Featured Image
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all transform active:scale-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      id="image-upload"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="sr-only"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                    >
                      <Camera className="w-10 h-10 text-gray-400 group-hover:text-purple-500 transition-colors mb-2" />
                      <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">Click to upload cover image</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Article Content *
                </label>
                <TextEditor
                  content={formData.description}
                  onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/news"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Article"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
