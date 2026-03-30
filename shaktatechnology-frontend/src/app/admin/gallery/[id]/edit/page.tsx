"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getGallery, updateGallery } from "@/lib/api";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  ImagePlus,
  RefreshCw,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServerImage {
  url: string;      // full URL to display
  filename: string; // raw filename stored in DB
}

type ImageSlot =
  | { kind: "existing"; data: ServerImage; markedForRemoval: boolean }
  | { kind: "new"; file: File; preview: string };

interface Gallery {
  id: number;
  title: string;
  description?: string;
  // Support both single-image and multi-image API shapes
  image?: string;
  image_url?: string;
  images?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || ""
    : "";

function resolveUrl(img: string): string {
  return img.startsWith("http") ? img : `${STORAGE_URL}/storage/${img}`;
}

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [gallery, setGallery] = useState<Gallery | null>(null);

  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [imageError, setImageError] = useState<string>("");

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const replaceInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const fetchGallery = async () => {
    try {
      setFetching(true);
      const response = await getGallery(id);
      const data: Gallery = response?.data || response;
      if (!data) throw new Error("Gallery not found");

      setGallery(data);
      setFormData({ title: data.title || "", description: data.description || "" });

      // Normalise to ImageSlot[]
      let initialSlots: ImageSlot[] = [];

      if (data.images && data.images.length > 0) {
        initialSlots = data.images.map((img) => ({
          kind: "existing" as const,
          data: {
            filename: img,
            url: img.startsWith("http") ? img : resolveUrl(img),
          },
          markedForRemoval: false,
        }));
      } else if (data.image || data.image_url) {
        const raw = data.image || "";
        initialSlots = [
          {
            kind: "existing" as const,
            data: { url: resolveUrl(raw), filename: raw },
            markedForRemoval: false,
          },
        ];
      }

      setSlots(initialSlots);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      alert("Failed to load gallery item");
      router.push("/admin/gallery");
    } finally {
      setFetching(false);
    }
  };

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Image handlers ─────────────────────────────────────────────────────────

  const validateFiles = (
    files: FileList | File[]
  ): { valid: File[]; error: string } => {
    const arr = Array.from(files);
    const invalid = arr.filter((f) => !VALID_TYPES.includes(f.type));
    const tooBig = arr.filter((f) => f.size > MAX_SIZE);
    if (invalid.length)
      return {
        valid: [],
        error: "Some files have unsupported formats. Use PNG, JPG, GIF, or WebP.",
      };
    if (tooBig.length)
      return { valid: [], error: "Each image must be less than 5 MB." };
    return { valid: arr, error: "" };
  };

  // Add multiple new images via the bulk upload zone
const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const { valid, error } = validateFiles(files);
    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive"
      });
      e.target.value = "";
      return;
    }
    setImageError("");

    const newSlots: ImageSlot[] = valid.map((file) => ({
      kind: "new" as const,
      file,
      preview: URL.createObjectURL(file),
    }));

    setSlots((prev) => [...prev, ...newSlots]);
    e.target.value = "";
  };

  // Drag-and-drop on upload zone
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const { valid, error } = validateFiles(files);
    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive"
      });
      return;
    }
    setImageError("");
    const newSlots: ImageSlot[] = valid.map((file) => ({
      kind: "new" as const,
      file,
      preview: URL.createObjectURL(file),
    }));
    setSlots((prev) => [...prev, ...newSlots]);
  };

  // Remove a slot: mark existing for removal (toggle), delete new slots outright
  const handleRemoveSlot = (index: number) => {
    setSlots((prev) => {
      const slot = prev[index];
      if (slot.kind === "new") {
        URL.revokeObjectURL(slot.preview);
        return prev.filter((_, i) => i !== index);
      }
      // Toggle removal flag for existing images
      return prev.map((s, i) =>
        i === index && s.kind === "existing"
          ? { ...s, markedForRemoval: !s.markedForRemoval }
          : s
      );
    });
  };

  // Replace a specific slot with a new file
  const handleReplaceSlot = (index: number, file: File) => {
    const { valid, error } = validateFiles([file]);
    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive"
      });
      return;
    }
    setImageError("");

    setSlots((prev) => {
      const slot = prev[index];
      const newSlot: ImageSlot = {
        kind: "new",
        file,
        preview: URL.createObjectURL(file),
      };

      if (slot.kind === "new") {
        // Swap new slot in place
        URL.revokeObjectURL(slot.preview);
        const updated = [...prev];
        updated[index] = newSlot;
        return updated;
      }

      // For existing: mark for removal, insert replacement right after
      const updated = prev.map((s, i) =>
        i === index && s.kind === "existing"
          ? { ...s, markedForRemoval: true }
          : s
      );
      updated.splice(index + 1, 0, newSlot);
      return updated;
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

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

    try {
      const submitData = new FormData();
      // Laravel method spoofing — required for multipart PUT requests
      submitData.append("_method", "PUT");
      submitData.append("title", formData.title);
      if (formData.description) submitData.append("description", formData.description);

      // Filenames of existing images the user wants to keep
      const keepFiles = slots
        .filter(
          (s): s is Extract<ImageSlot, { kind: "existing" }> =>
            s.kind === "existing" && !s.markedForRemoval
        )
        .map((s) => s.data.filename);

      keepFiles.forEach((filename) =>
        submitData.append("existing_images[]", filename)
      );

      // New image files to upload
      slots
        .filter(
          (s): s is Extract<ImageSlot, { kind: "new" }> => s.kind === "new"
        )
        .forEach((s) => submitData.append("images[]", s.file));

      await updateGallery(id, submitData);
      toast({
        title: "Success",
        description: "Gallery updated successfully"
      });
      router.push("/admin/gallery");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to update gallery:", error);
      
      // Handle validation errors from backend
      if (error.response?.status === 422 && error.response?.data) {
        const { message = "Upload failed", errors = {} } = error.response.data;
        
        // Check if errors are related to image upload
        const hasImageErrors = Object.keys(errors).some(key => 
          key.includes('images') || key.includes('existing_images')
        );
        
        if (hasImageErrors) {
          // Show a clean, user-friendly message about image requirements
          toast({
            title: "Image Upload Failed",
            description: "All images must be in PNG, JPG, GIF, or WebP format and less than 5MB each. Please check your images and try again.",
            variant: "destructive"
          });
        } else {
          // Show other validation errors
          const errorList = Object.entries(errors).flatMap(([field, msgs]) => 
            (msgs as string[]).map((msg) => `${field}: ${msg}`)
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
          title: "Failed to update gallery",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const activeCount = slots.filter(
    (s) =>
      s.kind === "new" || (s.kind === "existing" && !s.markedForRemoval)
  ).length;

  const removedCount = slots.filter(
    (s) => s.kind === "existing" && s.markedForRemoval
  ).length;

  // ── Loading / Not-found states ─────────────────────────────────────────────

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-600 dark:text-gray-300">
            Loading gallery item...
          </span>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Gallery item not found
          </h2>
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Gallery
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Gallery Item
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update details and manage images
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  fieldErrors.title
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                placeholder="Enter gallery item title"
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter description (optional)"
              />
            </div>

            {/* ── Images section ─────────────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Images * (Up to 5MB each)
                </label>
                {activeCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {activeCount} active
                  </span>
                )}
                {removedCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                    {removedCount} will be removed
                  </span>
                )}
              </div>

              {/* Image grid */}
              {slots.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {slots.map((slot, index) => {
                    const isNew = slot.kind === "new";
                    const isRemoving =
                      slot.kind === "existing" && slot.markedForRemoval;
                    const src = isNew ? slot.preview : slot.data.url;
                    const name = isNew ? slot.file.name : slot.data.filename;

                    return (
                      <div
                        key={index}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          isRemoving
                            ? "border-red-400 dark:border-red-500"
                            : isNew
                            ? "border-indigo-400 dark:border-indigo-500"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {/* Square image area */}
                        <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700 relative">
                          <Image
                            src={src}
                            alt={name}
                            fill
                            className={`object-cover transition-all duration-200 ${
                              isRemoving ? "grayscale opacity-50" : ""
                            }`}
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />

                          {/* Removal overlay */}
                          {isRemoving && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full shadow">
                                Will be removed
                              </span>
                            </div>
                          )}

                          {/* "New" badge */}
                          {isNew && (
                            <div className="absolute top-2 left-2 pointer-events-none">
                              <span className="text-xs font-semibold text-white bg-indigo-500 px-1.5 py-0.5 rounded-full shadow">
                                New
                              </span>
                            </div>
                          )}

                          {/* ── Action buttons (top-right) ── */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1.5">

                            {/* X button — removes new, toggles removal on existing */}
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(index)}
                              title={isRemoving ? "Undo remove" : "Remove image"}
                              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                isRemoving
                                  ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400"
                                  : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
                              }`}
                            >
                              {isRemoving ? (
                                /* Undo arrow icon */
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                  />
                                </svg>
                              ) : (
                                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                              )}
                            </button>

                            {/* Replace button — only when not already queued for removal */}
                            {!isRemoving && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    replaceInputRefs.current.get(index)?.click()
                                  }
                                  title="Replace with a different image"
                                  className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400"
                                >
                                  <RefreshCw
                                    className="w-3.5 h-3.5"
                                    strokeWidth={2.5}
                                  />
                                </button>

                                {/* Hidden per-slot replace input */}
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                  className="sr-only"
                                  ref={(el) => {
                                    if (el)
                                      replaceInputRefs.current.set(index, el);
                                    else replaceInputRefs.current.delete(index);
                                  }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleReplaceSlot(index, file);
                                    e.target.value = "";
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>

                        {/* Filename strip */}
                        <div
                          className={`px-2 py-1.5 border-t transition-colors ${
                            isRemoving
                              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                              : isNew
                              ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                              : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                          }`}
                        >
                          <p
                            className={`text-xs truncate ${
                              isRemoving
                                ? "text-red-500 dark:text-red-400 line-through"
                                : isNew
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-all group"
              >
                {/* Invisible label covers the whole zone for click-to-upload */}
                <label
                  htmlFor="images-bulk-input"
                  className="absolute inset-0 cursor-pointer"
                  aria-label="Upload images"
                />
                <input
                  id="images-bulk-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  multiple
                  onChange={handleAddImages}
                  className="sr-only"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900 transition-colors">
                    <ImagePlus className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      Click to add images
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Select multiple files or drag &amp; drop — PNG, JPG, GIF,
                      WebP up to 5 MB each
                    </p>
                  </div>
                </div>
              </div>

              {imageError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {imageError}
                </p>
              )}

              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </span>
                  Remove image
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-sm">
                    <RefreshCw
                      className="w-3 h-3 text-gray-600 dark:text-gray-300"
                      strokeWidth={2.5}
                    />
                  </span>
                  Replace image
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  New (unsaved)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/gallery"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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