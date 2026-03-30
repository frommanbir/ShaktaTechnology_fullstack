import Heading from "@/components/news/Heading";
import NewsCard from "@/components/news/NewsCard";
import { getNews } from "@/lib/api";

export const revalidate = 60;

export interface NewsItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  read_time?: string;
  featured?: boolean;
  date?: string;
  image?: string;
}

export default async function NewsPage() {
  let newsList: NewsItem[] = [];

  try {
    newsList = await getNews();
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  const featured = newsList.filter((n) => n.featured);
  const recent = newsList.filter((n) => !n.featured);

  const isEmpty = featured.length === 0 && recent.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero / Heading */}
      <Heading />

      {/* Global Empty State */}
      {isEmpty && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No news available at the moment.
          </p>
        </div>
      )}

      {/* Featured Stories */}
      {featured.length > 0 && (
        <section className="px-6 lg:px-20 py-14">
          <h2 className="text-3xl font-bold mb-10 text-center md:text-left">
            Featured{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Stories
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((item) => (
              <NewsCard key={item.id} news={item} featured />
            ))}
          </div>
        </section>
      )}

      {/* Recent Updates */}
      {recent.length > 0 && (
        <section className="px-6 lg:px-20 py-14 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
          <h2 className="text-3xl font-bold mb-10 text-center md:text-left">
            Recent{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Updates
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}