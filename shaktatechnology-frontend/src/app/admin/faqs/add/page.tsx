"use client";

import { useState } from "react";
import { createFaq } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

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
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Add FAQ</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 space-y-6 transition-colors duration-300"
      >
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Question *
          </label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Answer *
          </label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/faqs")}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}
