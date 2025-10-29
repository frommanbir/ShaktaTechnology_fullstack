"use client";

import { useState } from "react";
import { createMember } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AddMemberPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "",
    experience: "",
    projects_involved: "",
    about: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    github: "",
    address: "",
    short_description: "",
    training: "",
    education: "",
    reference: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle text and textarea fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input (image)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));

    // Show preview
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value as any);
        }
      });

      // Debug check (optional)
      // for (let pair of data.entries()) console.log(pair[0], pair[1]);

      await createMember(data);
      router.push("/admin/members");
    } catch (err: any) {
      console.error("Error:", err.response?.data);
      setError(
        err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : err.response?.data?.message || "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Member</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name and Email */}
        <div>
          <label className="block text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Other text fields */}
        {[
          "phone",
          "department",
          "position",
          "role",
          "experience",
          "projects_involved",
          "linkedin",
          "facebook",
          "instagram",
          "github",
          "address",
          "training",
          "education",
          "reference",
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 mb-2 capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}

        {/* About */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Short Description</label>
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={2}
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
          />

          {preview && (
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
}
