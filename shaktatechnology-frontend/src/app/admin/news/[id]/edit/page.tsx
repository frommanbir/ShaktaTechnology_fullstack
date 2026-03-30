"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getNewsItem, updateNews } from "@/lib/api";
import { News } from "@/components/types/news";
import TextEditor from "@/components/global/TextEditor";
import { ArrowLeft, Loader2, Save, X, Camera, Trash2, Edit } from "lucide-react";
import Image from "next/image";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newsItem, setNewsItem] = useState<News | null>(null);
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

  // Image management state
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        const data = await getNewsItem(id);
        setNewsItem(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "General",
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          author: data.author || "",
          read_time: data.read_time || "",
          featured: !!data.featured,
          image: null,
        });

        if (data.image) {
          const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || "";
          const url = data.image.startsWith("http")
            ? data.image
            : `${storageUrl}/storage/${data.image}`;
          setExistingImageUrl(url);
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setError("Failed to fetch news article");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNewsItem();
  }, [id]);

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
      setNewImagePreview(URL.createObjectURL(file));
      setRemoveExistingImage(false);
    }
  };

  const cancelNewImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setNewImagePreview(null);
  };

  const handleRemoveExisting = () => {
    setRemoveExistingImage(true);
  };

  const undoRemoveExisting = () => {
    setRemoveExistingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image") {
           if (value instanceof File) {
             submitData.append("image", value);
           } else if (removeExistingImage) {
             submitData.append("remove_image", "1");
           }
        } else if (key === "featured") {
          submitData.append(key, value ? "1" : "0");
        } else if (value !== null && value !== "") {
          submitData.append(key, value.toString());
        }
      });

      await updateNews(id, submitData);
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      console.error("Error updating news:", err);
      setError("Failed to update news article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading article details...</p>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            News article not found.
          </p>
          <Link
            href="/admin/news"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 mt-2 inline-block"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

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
                <Edit size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 italic">Edit Publication</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Refine and update news article details.</p>
             </div>
          </div>
        </div>

        {/* Error */}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                
                {/* New Preview */}
                {newImagePreview && (
                  <div className="mb-4">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">New Image (Unsaved)</p>
                    <div className="relative inline-block group">
                      <img
                        src={newImagePreview}
                        alt="New Preview"
                        className="w-full max-h-64 object-cover rounded-2xl border-4 border-purple-500 shadow-xl"
                      />
                      <button
                        type="button"
                        onClick={cancelNewImage}
                        className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Image */}
                {!newImagePreview && existingImageUrl && !removeExistingImage && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Current Cover</p>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="relative inline-block">
                        <img
                          src={existingImageUrl}
                          alt="Current"
                          className="w-full max-h-48 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                         <label htmlFor="image-replace" className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all font-bold border border-purple-100 dark:border-purple-800">
                            <Camera size={18} />
                            Replace Image
                            <input id="image-replace" type="file" onChange={handleFileChange} accept="image/*" className="sr-only" />
                         </label>
                         <button
                           type="button"
                           onClick={handleRemoveExisting}
                           className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all font-bold border border-red-100 dark:border-red-800"
                         >
                            <Trash2 size={18} />
                            Remove Current
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Removal Notice / Upload Zone */}
                {(!newImagePreview && (!existingImageUrl || removeExistingImage)) && (
                  <div className="space-y-4">
                    {removeExistingImage && (
                      <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
                         <p className="text-sm font-medium text-amber-700 dark:text-amber-400 italic">Current image will be deleted upon save.</p>
                         <button type="button" onClick={undoRemoveExisting} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline px-2">Undo Removal</button>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        id="image-new"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="sr-only"
                      />
                      <label
                        htmlFor="image-new"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                      >
                        <Camera className="w-10 h-10 text-gray-400 group-hover:text-purple-500 transition-colors mb-2" />
                        <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">Select new cover image</span>
                      </label>
                    </div>
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
                disabled={saving}
                className="px-10 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/30 active:scale-95 font-bold flex items-center gap-2"
              >
                {saving ? (
                   <>
                     <Loader2 size={18} className="animate-spin" />
                     Updating...
                   </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Publication
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
