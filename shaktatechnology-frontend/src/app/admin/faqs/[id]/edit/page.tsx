"use client";

import { useState, useEffect } from "react";
import { getFaq, updateFaq } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/Toast";
import { Loader2, ArrowLeft, Save, Edit } from "lucide-react";
import Link from "next/link";

export default function EditFaqPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFaq() {
      try {
        const response = await getFaq(parseInt(id));
        setFormData({
          question: response.question || "",
          answer: response.answer || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch FAQ");
      } finally {
        setLoading(false);
      }
    }
    fetchFaq();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateFaq(parseInt(id), formData);
      toast({
        title: "Success",
        description: "FAQ updated successfully!",
      });
      router.push("/admin/faqs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/faqs"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to FAQs
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl text-blue-600 dark:text-blue-400">
                <Edit size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit FAQ entry</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Refine and update an existing frequently asked question.</p>
             </div>
          </div>
        </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading FAQ details...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700/50 space-y-6 transition-colors duration-300"
        >
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Question *
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
              required
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Answer *
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-serif resize-y"
              rows={5}
              required
            />
          </div>

          <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => router.push("/admin/faqs")}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20 font-bold"
            >
              <Save size={18} />
              Update FAQ
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}
