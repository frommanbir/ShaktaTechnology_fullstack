"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFaqs } from "@/lib/api";
import { Loader2, ArrowLeft, Edit, MessageSquare, HelpCircle, Calendar, Archive } from "lucide-react";
import Link from "next/link";

interface Faq {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export default function ViewFaqPage() {
  const params = useParams();
  const router = useRouter();
  const [faq, setFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFaq() {
      try {
        const id = Number(params.id);
        const response = await getFaqs();
        const found = (response.data || []).find((f: Faq) => f.id === id);
        if (found) {
          setFaq(found);
        } else {
          setError("Question entry not found in the official archives.");
        }
      } catch (err) {
        setError("Error loading retrieval sequence.");
      } finally {
        setLoading(false);
      }
    }
    fetchFaq();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <div className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-[10px]">Retrieving FAQ Details...</div>
      </div>
    );
  }

  if (error || !faq) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-10 rounded-3xl border border-emerald-100 dark:border-emerald-800 shadow-xl shadow-emerald-500/5 transition-all">
           <HelpCircle className="w-16 h-16 text-emerald-300 mx-auto mb-6 opacity-40" />
           <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">Resource Unknown</h2>
           <p className="text-emerald-600 dark:text-emerald-300 mb-8 leading-relaxed font-medium">{error || "The specified knowledge entry is currently unavailable."}</p>
           <button 
             onClick={() => router.back()}
             className="px-10 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-500/20 active:scale-95"
           >
             Go Back
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Knowledge Header */}
      <div className="flex justify-between items-center mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.2em] font-black">Knowledge Base</span>
        </button>
        
        <Link
          href={`/admin/faqs/${faq.id}/edit`}
          className="flex items-center gap-2.5 px-7 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30 active:scale-95 font-bold"
        >
          <Edit className="w-4 h-4" />
          Refine Response
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
         {/* Question Section */}
         <section className="relative pl-12">
            <div className="absolute top-0 left-0 w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-50 dark:border-emerald-800/50">
               <HelpCircle className="w-4 h-4" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.3em] mb-4">Official Query</p>
               <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-[1.25]">{faq.question}</h1>
            </div>
         </section>

         {/* Answer Section */}
         <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-12 border border-emerald-50 dark:border-emerald-900/10 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-1000" />
            
            <div className="relative">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em]">Published Expert Response</p>
               </div>
               
               <div 
                 className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-[1.8] font-medium transition-colors" 
                 dangerouslySetInnerHTML={{ __html: faq.answer }} 
               />
            </div>
         </div>

         {/* Stats Integration */}
         <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 group">
               <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-500">
                  <Calendar className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-300 m-0">Catalogued Date</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 m-0">{new Date(faq.created_at).toLocaleDateString()}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-4 group">
               <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:scale-110 group-hover:text-amber-500 transition-all duration-500">
                  <Archive className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-300 m-0">Internal Status</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 m-0 tracking-[0.1em]">ACTIVE_PRODUCTION</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
