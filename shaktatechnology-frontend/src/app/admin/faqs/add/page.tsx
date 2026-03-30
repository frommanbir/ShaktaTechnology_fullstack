"use client";

import { useState } from "react";
import { createFaq } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { ArrowLeft, MessageCircleQuestion, Save } from "lucide-react";
import Link from "next/link";

export default function AddFaqPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await createFaq(formData);
      toast({
        title: "Success",
        description: "FAQ created successfully!",
      });
      router.push("/admin/faqs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create FAQ");
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
                <MessageCircleQuestion size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add FAQ entry</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new frequently asked question and answer.</p>
             </div>
          </div>
        </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
            placeholder="e.g. What is your return policy?"
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
            placeholder="Provide a clear and concise answer..."
          />
        </div>

        <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => router.push("/admin/faqs")}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-blue-500/20 font-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">Processing...</span>
            ) : (
              <>
                <Save size={18} />
                Publish FAQ
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
