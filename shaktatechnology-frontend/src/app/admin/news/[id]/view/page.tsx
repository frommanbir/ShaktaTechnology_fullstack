"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNewsItem } from "@/lib/api";
import { News } from "@/components/types/news";
import { Loader2, ArrowLeft, Edit, Calendar, User, Tag, Globe, Share2, Printer, Star, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ViewNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    async function fetchNews() {
      try {
        const id = Number(params.id);
        const data = await getNewsItem(id);
        setArticle(data);
      } catch (err) {
        console.error("Error loading news:", err);
        setError("Article not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        <p className="text-gray-500 font-medium animate-pulse">Fetching article details...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl border border-red-100 dark:border-red-800 shadow-xl">
           <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-red-600 dark:text-red-400" />
           </div>
           <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Content Not Found</h2>
           <p className="text-red-600 dark:text-red-300 mb-8">{error || "The requested article does not exist."}</p>
           <button 
             onClick={() => router.push("/admin/news")}
             className="px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-500/25 active:scale-95"
           >
             Return to Newsroom
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="group p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-sm hover:shadow-xl active:scale-90"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
             <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {article.category || "General News"}
                </span>
                {article.featured && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                {article.title}
             </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
             onClick={() => window.print()}
             className="hidden sm:flex p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all shadow-sm active:scale-95"
           >
              <Printer className="w-5 h-5" />
           </button>
           <Link
             href={`/admin/news/${article.id}/edit`}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/30 active:scale-95 font-bold"
           >
             <Edit className="w-5 h-5" />
             Edit Publication
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Aspect: Main Reading Experience */}
        <div className="lg:col-span-8 space-y-10">
           {/* Featured Image Wrap */}
           {article.image && (
             <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                <Image
                  src={article.image.startsWith('http') ? article.image : `${storageUrl}/storage/${article.image}`}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                   <p className="text-white/80 text-sm italic">Press cover image for {article.title}</p>
                </div>
             </div>
           )}

           {/* Article Body */}
           <div className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-700/50 shadow-sm backdrop-blur-xl">
              <div 
                className="prose prose-lg md:prose-2xl dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-serif" 
                dangerouslySetInnerHTML={{ __html: article.description || "" }} 
              />
           </div>
        </div>

        {/* Right Aspect: Metadata & Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
           {/* Author & Publication Info */}
           <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
              
              <h3 className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.3em] mb-8">Publishing Details</h3>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                       <User className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Contributor</p>
                       <p className="text-lg font-bold text-gray-900 dark:text-white">{article.author || "Editorial Team"}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Release Date</p>
                       <p className="text-lg font-bold text-gray-900 dark:text-white">
                         {article.date ? new Date(article.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Draft'}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                       <Tag className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Classification</p>
                       <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{article.category || "News"}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                 <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300">
                    <Share2 className="w-4 h-4" />
                    Share Publication
                 </button>
              </div>
           </div>

           {/* Quick Stats / Summary Card */}
           <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden">
              <Newspaper className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
              <h4 className="text-purple-200 text-xs font-black uppercase tracking-widest mb-4">News Summary</h4>
              <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium italic">
                "{article.title}" is currently live on your public newsroom page. You can toggle its "Featured" status in the list view to promote it to the homepage.
              </p>
              <div className="flex items-center gap-3">
                 <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md text-[11px] font-black uppercase tracking-widest border border-white/10">
                    ID: #{article.id}
                 </div>
                 <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md text-[11px] font-black uppercase tracking-widest border border-white/10">
                    {article.featured ? 'Featured' : 'Standard'}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
