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
       <div className="p-6 max-w-4xl mx-auto">
         <h1 className="text-2xl font-bold mb-6">Add FAQ</h1>

         {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
           <div>
             <label className="block text-gray-700 mb-2">Question *</label>
             <input
               type="text"
               name="question"
               value={formData.question}
               onChange={handleChange}
               className="w-full px-3 py-2 border rounded-md"
               required
               maxLength={255}
             />
           </div>
           <div>
             <label className="block text-gray-700 mb-2">Answer *</label>
             <textarea
               name="answer"
               value={formData.answer}
               onChange={handleChange}
               className="w-full px-3 py-2 border rounded-md"
               rows={4}
               required
             />
           </div>
           <div className="flex justify-end space-x-3">
             <button
               type="button"
               onClick={() => router.push("/admin/faqs")}
               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
               disabled={loading}
             >
               Cancel
             </button>
             <button
               type="submit"
               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
               disabled={loading}
             >
               {loading ? "Creating..." : "Create FAQ"}
             </button>
           </div>
         </form>
       </div>
     );
   }