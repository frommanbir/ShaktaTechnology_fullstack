"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCareerById } from "@/lib/api";
import { Career } from "@/components/types/CareerTypes";
import { Loader2, ArrowLeft, Edit, Calendar, MapPin, Briefcase, Users } from "lucide-react";
import Link from "next/link";

export default function ViewCareerPage() {
  const params = useParams();
  const router = useRouter();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCareer() {
      try {
        const id = Number(params.id);
        const data = await getCareerById(id);
        setCareer(data);
      } catch (err) {
        setError("Error loading job details.");
      } finally {
        setLoading(false);
      }
    }
    fetchCareer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Retrieving job posting...</p>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800">
           <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Occurred</h2>
           <p className="text-red-600 dark:text-red-300 mb-6">{error || "Job posting not found."}</p>
           <button 
             onClick={() => router.back()}
             className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
           >
             Go Back
           </button>
        </div>
      </div>
    );
  }

  const isActive = career.is_active !== false;

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in border-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="flex items-start gap-5">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{career.title}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                  {isActive ? "Publicly Active" : "Internal Only"}
                </span>
             </div>
             
             <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                   <Briefcase className="w-4 h-4 text-blue-500" />
                   <span className="font-medium">{career.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Users className="w-4 h-4 text-blue-500" />
                   <span className="font-medium">{career.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <MapPin className="w-4 h-4 text-blue-500" />
                   <span className="font-medium">{career.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Calendar className="w-4 h-4 text-blue-500" />
                   <span className="font-medium">Posted: {new Date(career.created_at || "").toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        </div>
        
        <Link
          href={`/admin/careers/${career.id}/edit`}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg active:scale-95 font-semibold"
        >
          <Edit className="w-4 h-4" />
          Edit Posting
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
           {/* Description */}
           <section>
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <span className="w-8 h-px bg-blue-100 dark:bg-blue-900/50" />
                 The Opportunity
              </h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: career.description }} 
              />
           </section>

           {/* Requirements */}
           <section>
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <span className="w-8 h-px bg-blue-100 dark:bg-blue-900/50" />
                 Qualities & Experience
              </h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: career.requirements || 'Contact the hiring manager for role-specific requirements.' }} 
              />
           </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
           {/* Benefits */}
           <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-6">Benefits & Culture</h2>
              <div 
                className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-400 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: career.benefits || 'Standard benefits apply, including health insurance and professional development pathways.' }} 
              />
           </div>

           {/* Internal Context */}
           <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-4">Hiring Workflow</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                 Applications for this role will be routed to the <strong>{career.department} HR</strong> queue. Ensure all requirements are updated to attract the right talent.
              </p>
              <div className="mt-6 p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                 <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{isActive ? "Public" : "Draft/Internal"}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
