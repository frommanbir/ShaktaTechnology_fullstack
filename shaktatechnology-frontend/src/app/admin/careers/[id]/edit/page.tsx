"use client";

import { useState, useEffect } from "react";
import { getCareer, updateCareer, getCareerTypes } from "@/lib/api";
import { Loader2, ArrowLeft, Briefcase, Save, Edit } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import TextEditor from "@/components/global/TextEditor";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function EditCareerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    description: "",
    requirements: "",
    benefits: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [careerTypes, setCareerTypes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    async function fetchCareer() {
      setLoading(true);
      try {
        const data = await getCareer(Number(id));
        setFormData({
          title: data.title || "",
          department: data.department || "",
          location: data.location || "",
          type: data.type || "full-time",
          description: data.description || "",
          requirements: data.requirements || "",
          benefits: data.benefits || "",
        });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to fetch career",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCareer();
    getCareerTypes().then((data) => setCareerTypes(data));
  }, [id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateCareer(Number(id), formData);
      toast({
        title: "Updated",
        description: "Career opportunity updated successfully!",
      });
      router.push("/admin/careers");
    } catch (err: any) {
      const apiError = err.response?.data;
      let errorMessage = "Failed to update career";

      if (apiError?.errors) {
        const firstErrorField = Object.keys(apiError.errors)[0];
        errorMessage = apiError.errors[firstErrorField][0] || "Validation error";
      } else {
        errorMessage = apiError?.message || "Failed to update career";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading career details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/careers" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Careers</span>
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl text-blue-600 dark:text-blue-400">
            <Edit size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 italic">Edit Career</h1>
            <p className="text-gray-600 dark:text-gray-400">Update job information and recruitment status.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / New York"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employment Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all cursor-pointer font-medium"
                  required
                >
                  {careerTypes.length === 0 ? (
                    <option value={formData.type}>{formData.type || 'Loading...'}</option>
                  ) : (
                    careerTypes.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Job Description *</label>
                <TextEditor
                  content={formData.description || ""}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Describe the role, responsibilities, and team culture..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Requirements *</label>
                <TextEditor
                  content={formData.requirements || ""}
                  onChange={(value) => setFormData((prev) => ({ ...prev, requirements: value }))}
                  placeholder="What are the essential skills and experiences for this role?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Benefits & Perks</label>
                <TextEditor
                  content={formData.benefits || ""}
                  onChange={(value) => setFormData((prev) => ({ ...prev, benefits: value }))}
                  placeholder="What makes working here great? Insurance, PTO, learning budget..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pb-12">
            <button
              type="button"
              onClick={() => router.push("/admin/careers")}
              className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-semibold flex items-center gap-2 active:scale-95 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Update Career</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
