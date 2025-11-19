"use client";

import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    description?: string;
    category?: string;
    date?: string;
    author?: string;
    read_time?: string;
    featured?: boolean;
    image?: string;
  };
  featured?: boolean;
}

export default function NewsCard({ news, featured = false }: NewsCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl shadow-sm bg-white dark:bg-gray-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
        featured ? "border border-purple-200 dark:border-purple-700" : "border border-transparent"
      }`}
    >
      {/* Image Section */}
      <div className={`relative w-full ${featured ? "h-64" : "h-52"} overflow-hidden`}>
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes="(max-width: 640px) 100vw,
                   (max-width: 768px) 50vw,
                   33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-300 text-sm">
            No Image
          </div>
        )}

        {/* Featured Tag */}
        {news.featured && (
          <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
            Featured
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Category + Date + Read time + Author */}
        <div className="flex flex-wrap items-center gap-3 text-gray-500 dark:text-gray-300 text-xs mb-3">
          {news.category && (
            <span className="font-medium text-purple-600 dark:text-purple-400">{news.category}</span>
          )}
          {news.date && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(news.date).toLocaleDateString()}
            </span>
          )}
          {news.read_time && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {news.read_time}
            </span>
          )}
          {news.author && (
            <span className="flex items-center gap-1">
              <User size={14} />
              {news.author}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`font-semibold text-gray-900 dark:text-white ${
            featured ? "text-lg md:text-xl" : "text-base md:text-lg"
          } line-clamp-2`}
        >
          {news.title}
        </h3>

        {/* Description */}
        {news.description && (
          <p
            className={`mt-2 ${
              featured ? "text-sm md:text-base line-clamp-3" : "text-sm line-clamp-2"
            } text-gray-600 dark:text-gray-300`}
          >
            {news.description}
          </p>
        )}

        {/* Read More Button */}
        <div className="mt-5">
          <Link
            href={`/news/${news.id}`}
            className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium text-sm hover:gap-2 transition-all"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
