"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGallery } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CreateGalleryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    const validFiles = files.filter(file => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file types",
        description: "Please select valid image files (PNG, JPG, GIF, WebP)",
        variant: "destructive"
      });
      return;
    }

    const sizeValidFiles = validFiles.filter(file => file.size <= 5 * 1024 * 1024);
    if (sizeValidFiles.length !== validFiles.length) {
      toast({
        title: "File too large",
        description: "Images must be less than 5MB each",
        variant: "destructive"
      });
      return;
    }

    if (sizeValidFiles.length === 0) return;

    setFormData(prev => ({ ...prev, images: [...prev.images, ...sizeValidFiles] }));

    const newPreviews = sizeValidFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one image is required",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      if (formData.description) submitData.append("description", formData.description);
      
      formData.images.forEach((image, index) => {
        submitData.append(`images[${index}]`, image);
      });

      await createGallery(submitData);
      toast({
        title: "Success",
        description: "Gallery created successfully"
      });
      router.push("/admin/gallery");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to create gallery:", error);
      
      // Handle validation errors from backend
      if (error.response?.status === 422 && error.response?.data) {
        const { message = "Upload failed", errors = {} } = error.response.data;
        
        // Check if errors are related to image upload
        const hasImageErrors = Object.keys(errors).some(key => key.includes('images'));
        
        if (hasImageErrors) {
          // Show a clean, user-friendly message about image requirements
          toast({
            title: "Image Upload Failed",
            description: "All images must be in PNG, JPG, GIF, or WebP format and less than 5MB each. Please check your images and try again.",
            variant: "destructive"
          });
        } else {
          // Show other validation errors
          const errorList = Object.entries(errors).flatMap(([field, msgs]: [string, any[]]) => 
            msgs.map((msg: string) => `${field}: ${msg}`)
          ).join('\n');
          toast({
            title: message,
            description: errorList || "Please check your input",
            variant: "destructive"
          });
        }
      } else if (error.response?.status === 413) {
        // Handle payload too large error
        toast({
          title: "File Too Large",
          description: "The total upload size is too large. Please ensure each image is less than 5MB.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to create gallery",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[indexToRemove]);
      newPreviews.splice(indexToRemove, 1);
      return newPreviews;
    });
  };

  return (
    <div className="p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Gallery
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Gallery Item</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new gallery item with image and description
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
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
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Enter gallery item title"
              />
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
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder="Enter gallery item description (optional)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Images * (Up to 5MB each)
              </label>

              {imagePreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative inline-block">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-32 border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md transition-colors">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="image"
                        name="images"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF, WebP up to 5MB each (Multiple files allowed)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/gallery"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Gallery Item
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