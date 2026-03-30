"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTestimonial } from "@/lib/api";
import { Loader2, ArrowLeft, Edit, Calendar, User, MessageSquare, Quote, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image?: string;
  created_at?: string;
}

export default function ViewTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const id = Number(params.id);
        const data = await getTestimonial(id);
        setTestimonial(data);
      } catch (err) {
        console.error("Error loading testimonial:", err);
        setError("Testimonial not found.");
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonial();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Fetching testimonial...</p>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl border border-red-100 dark:border-red-800 shadow-xl">
           <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Error</h2>
           <p className="text-red-600 dark:text-red-300 mb-8">{error || "Testimonial not found."}</p>
           <button 
             onClick={() => router.push("/admin/testimonials")}
             className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-500/25 active:scale-95"
           >
             Go Back
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-xl active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Review Details</h1>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                <Calendar className="w-3 h-3" />
                <span>Submitted on {new Date(testimonial.created_at || "").toLocaleDateString()}</span>
             </div>
          </div>
        </div>
        <Link
          href={`/admin/testimonials/${testimonial.id}/edit`}
          className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 font-bold"
        >
          <Edit className="w-4 h-4" />
          Edit Feedback
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Aspect: Profile */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
              
              <div className="relative w-32 h-32 mx-auto mb-6">
                <Image
                  src={
                    testimonial.image
                      ? testimonial.image.startsWith('http')
                        ? testimonial.image
                        : `${storageUrl}${testimonial.image}`
                      : '/images/placeholder-avatar.jpg'
                  }
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                />
              </div>

              <div className="text-center">
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{testimonial.name}</h2>
                 <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">{testimonial.role}</p>
                 
                 <div className="flex items-center justify-center gap-1 mt-4 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700">
                 <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Identity Status</span>
                    <span className="text-green-500">Verified</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Aspect: Testimonial Text */}
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700/50 shadow-sm relative backdrop-blur-xl">
              <Quote className="absolute top-8 left-8 w-16 h-16 text-blue-500/10 -z-10" />
              <h3 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-10">Client Statement</h3>
              
              <div className="relative">
                 <div className="prose prose-xl dark:prose-invert italic text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
                   "{testimonial.text}"
                 </div>
              </div>

              <div className="mt-12 flex justify-end">
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
