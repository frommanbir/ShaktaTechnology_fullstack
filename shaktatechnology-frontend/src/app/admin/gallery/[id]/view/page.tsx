"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGalleries } from "@/lib/api"; // getGalleries returns all, I'll filter
import { Loader2, ArrowLeft, Edit, Image as ImageIcon, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

export default function ViewGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      try {
        const id = Number(params.id);
        const data = await getGalleries();
        const found = data.find((g: Gallery) => g.id === id);
        if (found) {
          setItem(found);
        } else {
          setError("Gallery item not found in repository.");
        }
      } catch (err) {
        setError("Error fetching gallery metadata.");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Processing Image Visual...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border border-orange-100 dark:border-orange-800">
           <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-3">Asset Not Available</h2>
           <p className="text-orange-600 dark:text-orange-300 mb-8 leading-relaxed">{error || "The specified visual asset is not currently indexed."}</p>
           <button 
             onClick={() => router.back()}
             className="px-8 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all font-bold shadow-lg shadow-orange-500/20 active:scale-95"
           >
             Go Back
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      {/* Visual Header */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all shadow-sm hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-widest uppercase">Archive</span>
        </button>
        
        <Link
          href={`/admin/gallery/${item.id}/edit`}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl active:scale-95 font-bold"
        >
          <Edit className="w-4 h-4" />
          Modify Asset
        </Link>
      </div>

      <div className="space-y-12">
         {/* Asset Visualization */}
         <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-950 p-4 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 dark:from-gray-900 via-transparent to-transparent pointer-events-none" />
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-inner border border-gray-100/50 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-900">
              {item.image ? (
                <Image 
                  src={item.image.startsWith("http") ? item.image : `/${item.image}`} 
                  alt={item.title} 
                  fill 
                  className="object-contain" 
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 dark:text-gray-800">
                   <ImageIcon className="w-32 h-32 mb-4" />
                   <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Missing Asset</p>
                </div>
              )}
            </div>
            
            {/* Context Badge */}
            <div className="absolute bottom-10 left-10 p-4 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl animate-in slide-in-from-left-4 duration-1000 delay-300">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                     <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-white/60 tracking-widest m-0 leading-none mb-1">Gallery Type</p>
                     <p className="text-sm font-bold text-white uppercase tracking-[0.2em] leading-none m-0">Visual Medium</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Meta Detailed Data */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-4">
            <div className="md:col-span-2">
               <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-6 tracking-tight leading-tight">{item.title}</h1>
               <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 font-medium leading-[1.8]">
                  {item.description || "No specific metadata or descriptor provided for this visual asset."}
               </div>
            </div>
            <div className="space-y-8">
               <div className="p-8 bg-orange-50/30 dark:bg-orange-950/20 rounded-[2.5rem] border border-orange-100 dark:border-orange-800 shadow-sm transition-all hover:shadow-xl hover:shadow-orange-500/5 group">
                  <h4 className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] mb-4">Internal Stats</h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">Asset ID</span>
                        <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 transition-colors">#{item.id}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">Catalogued</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">Active</span>
                     </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-orange-100 dark:border-orange-800/50">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        Archived System
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
