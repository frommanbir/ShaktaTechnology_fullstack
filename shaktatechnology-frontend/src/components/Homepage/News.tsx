"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNews } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { News } from "@/components/types/news";

export default function HomeNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news on mount
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await getNews();
        setNews(response);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-500">
        <p>{error}</p>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-16 text-center text-gray-600">
        <p>No news available right now.</p>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 text-center px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold">
        Latest <span className="text-violet-600">News & Insights</span>
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
        Stay updated with the latest updates and insights from our company.
      </p>

      {/* News Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {news.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Section */}
            <div className="relative w-full h-52 sm:h-56 lg:h-64 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 text-left">
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mt-3 text-sm sm:text-base line-clamp-3">
                {item.description || "No description available."}
              </p>

              <div className="mt-5">
                <Link
                  href={`/news/${item.id}`}
                  className="text-violet-600 font-medium text-sm hover:text-violet-700 transition"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12">
        <Link href="/news" passHref>
          <button className="group inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-gray-800 hover:bg-gray-100 font-medium text-sm sm:text-base transition-all duration-300">
            View All News
          </button>
        </Link>
      </div>
    </section>
  );
}
