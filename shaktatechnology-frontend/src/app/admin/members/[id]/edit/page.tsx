"use client";

import { useState, useEffect, useCallback } from "react";
import { getMember, updateMember } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Upload, X, User, Briefcase, Share2, Info } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import TextEditor from "@/components/global/TextEditor";

type TabType = "general" | "professional" | "social" | "about";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabType>("general");

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
    education: "",
    member_order: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
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
          education: member.education || "",
          member_order: member.member_order ? member.member_order.toString() : "",
          image: null,
        });
        if (member.image) {
          setExistingImage(member.image);
        }
      } catch (err) {
        toast.error("Failed to load member");
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, about: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image size should be less than 4MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setRemoveExistingImage(false);
    }
  };

  const handleRemovePreview = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleRemoveExisting = () => {
    setExistingImage(null);
    setRemoveExistingImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    setSubmitting(true);

    try {
      // Create a plain object for updateMember, which will handle its own FormData wrapping
      const dataToSubmit: any = { ...formData };
      
      // If we are removing the image, explicitly set the flag
      if (removeExistingImage && !formData.image) {
        dataToSubmit.remove_image = "true";
      }

      await updateMember(id, dataToSubmit);
      toast.success("Member updated successfully");
      router.push("/admin/members");
    } catch (err: any) {
      console.error("Error:", err.response?.data);
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        Object.values(backendErrors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || "Failed to update member");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "general", name: "General Info", icon: User },
    { id: "professional", name: "Professional", icon: Briefcase },
    { id: "social", name: "Social Media", icon: Share2 },
    { id: "about", name: "Biography", icon: Info },
  ];

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6" />
            Edit Member: {formData.name}
          </h1>
          <p className="text-blue-100 text-sm mt-1">Update the profile of this team member.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="min-h-[350px]">
            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Member Order
                    </label>
                    <input
                      type="number"
                      name="member_order"
                      value={formData.member_order}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Profile Image
                    </label>
                    {!preview && !existingImage ? (
                      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <p className="text-sm text-gray-500">Click to upload new image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-40 h-40 group">
                        <img
                          src={preview || existingImage!}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={preview ? handleRemovePreview : handleRemoveExisting}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Core Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Experience Summary
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Projects Involved
                    </label>
                    <textarea
                      name="projects_involved"
                      value={formData.projects_involved}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                   Biography
                  </label>
                  <TextEditor 
                    content={formData.about} 
                    onChange={handleEditorChange} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.push("/admin/members")}
              className="px-6 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Updating..." : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}