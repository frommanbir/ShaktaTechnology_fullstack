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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero / Heading */}
      <Heading />

      {/* Featured Stories */}
      <section className="px-6 lg:px-20 py-14">
        <h2 className="text-3xl font-bold mb-10 text-center md:text-left">
          Featured{" "}
          <span className="text-purple-600 dark:text-purple-400">Stories</span>
        </h2>

        {featured.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((item) => (
              <NewsCard key={item.id} news={item} featured />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No featured stories available.
          </p>
        )}
      </section>

      {/* Recent Updates */}
      <section className="px-6 lg:px-20 py-14 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-10 text-center md:text-left">
          Recent{" "}
          <span className="text-purple-600 dark:text-purple-400">Updates</span>
        </h2>

        {recent.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No recent news found.
          </p>
        )}
      </section>

      {/* Newsletter Section */}
      <footer className="bg-white dark:bg-gray-800 py-16 border-t border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
        <h3 className="text-2xl font-bold mb-4">
          Stay in the{" "}
          <span className="text-purple-600 dark:text-purple-400">Loop</span>
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Subscribe to receive the latest tech stories and updates.
        </p>

        <div className="flex justify-center gap-3 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
          />
          <button className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors duration-300">
            Subscribe
          </button>
        </div>
      </footer>
    </div>
  );
}
