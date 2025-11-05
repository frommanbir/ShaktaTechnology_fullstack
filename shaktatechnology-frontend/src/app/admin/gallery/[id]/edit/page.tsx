"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getGallery, updateGallery } from "@/lib/api";
import { ArrowLeft, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image?: string;
  image_url?: string;
}

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const fetchGallery = async () => {
    try {
      setFetching(true);
      const response = await getGallery(id);
      const data = response?.data || response;
      if (!data) throw new Error("Gallery not found");

      setGallery(data);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        image: null,
      });

      if (data.image_url || data.image) {
        setImagePreview(
          data.image?.startsWith("http")
            ? data.image
            : `${storageUrl}/storage/${data.image}`
        );
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      alert("Failed to load gallery item");
      router.push("/admin/gallery");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: "" }));

    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      if (formData.description) submitData.append("description", formData.description);
      if (formData.image) submitData.append("image", formData.image);

      await updateGallery(id, submitData);
      router.push("/admin/gallery");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to update gallery:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Failed to update gallery item. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(
      gallery?.image_url || (gallery?.image ? `${storageUrl}/storage/${gallery.image}` : null)
    );
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-600 dark:text-gray-300">Loading gallery item...</span>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gallery item not found</h2>
          <Link
            href="/admin/gallery"
            className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Gallery
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Gallery Item</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update gallery item details and image
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.title ? "border-red-300" : "border-gray-300 dark:border-gray-700"
                }`}
                placeholder="Enter gallery item title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter gallery item description (optional)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">
                  (Leave empty to keep current image)
                </span>
              </label>
              {imagePreview ? (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover border border-gray-300 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Click the X to remove the new image and keep the current one
                  </p>
                </div>
              ) : (
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload new image</span>
                        <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, WebP up to 5MB</p>
                  </div>
                </div>
              )}
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>

            {/* Current Image Info */}
            {gallery.image && !formData.image && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Current image:</strong> {gallery.image}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/gallery"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Gallery Item
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
