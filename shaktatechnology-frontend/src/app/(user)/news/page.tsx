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
    <div className="bg-gray-50 min-h-screen">

      <Heading />
      {/* Featured Stories */}
      <section className="px-6 lg:px-20 py-14">
        <h2 className="text-3xl font-bold mb-10">
          Featured <span className="text-purple-600">Stories</span>
        </h2>

        {featured.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((item) => (
              <NewsCard key={item.id} news={item} featured />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No featured stories available.</p>
        )}
      </section>

      {/* Recent Updates */}
      <section className="px-6 lg:px-20 py-14">
        <h2 className="text-3xl font-bold mb-10">
          Recent <span className="text-purple-600">Updates</span>
        </h2>

        {recent.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No recent news found.</p>
        )}
      </section>

      {/* Footer Newsletter */}
      <footer className="bg-white py-16 border-t text-center mt-auto">
        <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
        <div className="flex justify-center gap-2">
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
            Subscribe
          </button>
        </div>

      </footer>
    </div>
  );
}
