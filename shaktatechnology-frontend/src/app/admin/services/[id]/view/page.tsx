"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getService } from "@/lib/api";
import { Loader2, ArrowLeft, Edit, Calendar } from "lucide-react";
import Link from "next/link";

interface Service {
  id: number;
  title: string;
  description: string;
  features?: string[];
  technologies?: string[];
  created_at?: string;
}

export default function ViewServicePage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchService() {
      try {
        const id = Number(params.id);
        const response = await getService(id);
        if (response.success) {
          setService(response.data);
        } else {
          setError("Failed to fetch service details.");
        }
      } catch (err) {
        setError("Error loading service.");
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800">
           <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Occurred</h2>
           <p className="text-red-600 dark:text-red-300 mb-6">{error || "Service not found."}</p>
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

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{service.title}</h1>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                <Calendar className="w-3 h-3" />
                <span>Added on {new Date(service.created_at || "").toLocaleDateString()}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-blue-600 dark:text-blue-400">Service Detail</span>
             </div>
          </div>
        </div>
        <Link
          href={`/admin/services/${service.id}/edit`}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 font-semibold"
        >
          <Edit className="w-4 h-4" />
          Edit Service
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Principal Content */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-6">Service Overview</h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: service.description }} 
              />
           </div>
        </div>

        {/* Right Column - Secondary Content / Stats */}
        <div className="space-y-8">
           {/* Features */}
           <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-6">Key Features</h3>
              <div 
                className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-400" 
                dangerouslySetInnerHTML={{ __html: service.features?.[0] || '<em>No specific features listed.</em>' }} 
              />
           </div>

           {/* Tech Stack */}
           <div className="bg-gray-900 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-800">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-6">Technologies</h3>
              <div 
                className="prose prose-sm prose-invert text-gray-400 font-mono text-xs leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: service.technologies?.[0] || '<em>Standard modern tech stack.</em>' }} 
              />
           </div>

           {/* Metadata/Actions */}
           <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Technical Status</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Position is currently <strong>Active</strong> in the public service list.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
