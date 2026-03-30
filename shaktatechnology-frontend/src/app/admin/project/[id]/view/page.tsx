"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject } from "@/lib/api";
import { Loader2, ArrowLeft, Edit, Calendar, Layout, Award, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies?: string | string[];
  key_results?: string | string[];
  image?: string;
  created_at?: string;
}

export default function ViewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const id = Number(params.id);
        const data = await getProject(id);
        if (data) {
          setProject(data);
        } else {
          setError("Project details not found.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Error loading project details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse tracking-widest uppercase text-[10px]">Loading Case Study...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl border border-red-100 dark:border-red-800">
           <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-3">Project Not Found</h2>
           <p className="text-red-600 dark:text-red-300 mb-8 leading-relaxed">{error || "The requested project details are unavailable."}</p>
           <button 
             onClick={() => router.back()}
             className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-500/20 active:scale-95"
           >
             Return to Projects
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to List</span>
        </button>
        
        <Link
          href={`/admin/project/${project.id}/edit`}
          className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 active:scale-95 font-bold"
        >
          <Edit className="w-4 h-4" />
          Edit Case Study
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Project Imagery & Key Info */}
        <div className="lg:col-span-5 space-y-10">
           <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-2xl bg-white dark:bg-gray-900 group">
              {project.image ? (
                <Image 
                  src={
                    project.image.startsWith("http") 
                    ? project.image 
                    : (process.env.NEXT_PUBLIC_STORAGE_URL  ? `${process.env.NEXT_PUBLIC_STORAGE_URL}projects/${project.image}` : `/${project.image}`)
                  } 
                  alt={project.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-300">
                   <Layout className="w-16 h-16 mb-4 opacity-20" />
                   <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-50">No Cover Image</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>

           <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                 <Settings className="w-3 h-3" />
                 Built With Core Tech
              </h3>
              <div 
                className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-400 font-mono text-xs leading-relaxed" 
                dangerouslySetInnerHTML={{ 
                  __html: Array.isArray(project.technologies) 
                          ? project.technologies.join(", ") 
                          : project.technologies || '<em>No specific technologies listed.</em>' 
                }} 
              />
           </div>

           <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-900/30">
              <div className="flex items-center gap-3 text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">
                 <Calendar className="w-3 h-3" />
                 Archived Deployment
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                 This project was finalized and published on <strong>{new Date(project.created_at || "").toLocaleDateString()}</strong>. 
              </p>
           </div>
        </div>

        {/* Right: Detailed Content */}
        <div className="lg:col-span-7 space-y-12 py-4">
           <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4">Project Case Study</p>
              <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-[1.15] tracking-tight">{project.title}</h1>
              
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                 <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Mission & Scope</h2>
                 <div 
                   className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-medium" 
                   dangerouslySetInnerHTML={{ __html: project.description }} 
                 />
              </div>
           </div>

           <div className="relative pt-8">
              <div className="absolute top-0 left-0 w-12 h-1 bg-indigo-600/20 rounded-full" />
              <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 pt-4">
                 <Award className="w-4 h-4" />
                 Impact & Key Results
              </h2>
              <div 
                className="prose prose-md dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed italic" 
                dangerouslySetInnerHTML={{ 
                  __html: Array.isArray(project.key_results) 
                          ? project.key_results.join("<br />") 
                          : project.key_results || '<em>Data-driven results pending.</em>' 
                }} 
              />
           </div>
        </div>
      </div>
    </div>
  );
}
