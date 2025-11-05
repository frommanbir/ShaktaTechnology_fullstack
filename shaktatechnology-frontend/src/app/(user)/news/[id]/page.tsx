import { notFound } from "next/navigation"; 
import Image from "next/image";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getNews } from "@/lib/api";

interface News {
  id: number;
  title: string;
  description?: string;
  category?: string;
  date?: string;
  author?: string;
  read_time?: string;
  featured?: boolean;
  image?: string;
}

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const newsList: News[] = await getNews();
  const news = newsList.find((item: News) => item.id === parseInt(params.id));

  if (!news) {
    return { title: "News Not Found" };
  }

  return {
    title: `${news.title} | News`,
    description: news.description,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const newsList: News[] = await getNews();
  const news = newsList.find((item: News) => item.id === parseInt(params.id));

  if (!news) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4 text-gray-500 dark:text-gray-400">
            {news.category && (
              <span className="font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 px-3 py-1 rounded-full">
                {news.category}
              </span>
            )}
            {news.date && (
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(news.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {news.read_time && (
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {news.read_time}
              </span>
            )}
            {news.author && (
              <span className="flex items-center gap-1">
                <User size={16} />
                {news.author}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {news.title}
          </h1>

          {news.featured && (
            <div className="inline-flex items-center bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-6">
              Featured Story
            </div>
          )}
        </header>

        {/* Featured Image */}
        {news.image && (
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
          {news.description && (
            <div className="mb-8">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-700 dark:text-gray-200">
                {news.description}
              </p>
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="text-gray-700 dark:text-gray-200 leading-relaxed space-y-6">
              <p>
                This is placeholder content. In a real application, you would
                fetch the full article content from your API.
              </p>
              {news.description && (
                <p className="text-gray-600 dark:text-gray-400 italic">{news.description}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                Published on {new Date(news.date || "").toLocaleDateString()}
              </div>
              {news.author && (
                <div className="flex items-center gap-1">
                  <User size={16} />
                  By {news.author}
                </div>
              )}
            </div>
          </footer>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/news"
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to All News
          </Link>
        </div>
      </article>
    </div>
  );
}

// Static params for SSG
export async function generateStaticParams() {
  const newsList: News[] = await getNews();
  return newsList.map((news: News) => ({ id: news.id.toString() }));
}
