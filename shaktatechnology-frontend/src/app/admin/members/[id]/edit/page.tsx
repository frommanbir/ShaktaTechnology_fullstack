"use client";

import { useState, useEffect } from "react";
import { getMember, updateMember } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMember() {
      try {
        const member = await getMember(id);
        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          department: member.department || "",
          position: member.position || "",
          role: member.role || "",
          experience: member.experience || "",
          projects_involved: member.projects_involved || "",
          about: member.about || "",
          linkedin: member.linkedin || "",
          facebook: member.facebook || "",
          instagram: member.instagram || "",
          github: member.github || "",
          address: member.address || "", 
          short_description: member.short_description || "", 
          training: member.training || "", 
          education: member.education || "", 
          reference: member.reference || "", 
          image: null,
        });
      } catch (err) {
        setErrors({ general: "Failed to load member" });
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value) {
          data.append(key, value);
        } else if (value) {
          data.append(key, value as string);
        }
      });

      await updateMember(id, data);
      router.push("/admin/members");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors: { [key: string]: string } = {};
        Object.entries(err.response.data.errors).forEach(([key, messages]) => {
          backendErrors[key] = (messages as string[]).join(", ");
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.response?.data?.message || "Failed to update member" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div>
          <label className="block text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : ""}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : ""}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.department ? "border-red-500" : ""}`}
          />
          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.position ? "border-red-500" : ""}`}
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.role ? "border-red-500" : ""}`}
          />
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.experience ? "border-red-500" : ""}`}
          />
          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Projects Involved</label>
          <input
            type="text"
            name="projects_involved"
            value={formData.projects_involved}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.projects_involved ? "border-red-500" : ""}`}
          />
          {errors.projects_involved && <p className="text-red-500 text-sm mt-1">{errors.projects_involved}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.reference ? "border-red-500" : ""}`}
          />
          {errors.reference && <p className="text-red-500 text-sm mt-1">{errors.reference}</p>}
        </div>

        {/* Column 2 */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Short Description</label>
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.short_description ? "border-red-500" : ""}`}
            rows={3}
          />
          {errors.short_description && <p className="text-red-500 text-sm mt-1">{errors.short_description}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.about ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Training</label>
          <textarea
            name="training"
            value={formData.training}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.training ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.training && <p className="text-red-500 text-sm mt-1">{errors.training}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Education</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.education ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.linkedin ? "border-red-500" : ""}`}
          />
          {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Facebook</label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.facebook ? "border-red-500" : ""}`}
          />
          {errors.facebook && <p className="text-red-500 text-sm mt-1">{errors.facebook}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Instagram</label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.instagram ? "border-red-500" : ""}`}
          />
          {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">GitHub</label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.github ? "border-red-500" : ""}`}
          />
          {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-2">Image (upload new to replace)</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.image ? "border-red-500" : ""}`}
            accept="image/*"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        <div className="md:col-span-2 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/members")}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50`}
          >
            {submitting ? "Updating..." : "Update Member"}
          </button>
        </div>
      </form>
    </div>
  );
}