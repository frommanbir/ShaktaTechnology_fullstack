'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Users,
  FolderKanban,
  MessageSquare,
  Image,
  Newspaper,
} from 'lucide-react';
import {
  getMembers,
  getProjects,
  getTestimonials,
  getGalleries,
  getNews,
} from '@/lib/api';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    members: 0,
    projects: 0,
    testimonials: 0,
    gallery: 0,
    news: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [members, projects, testimonials, gallery, news] =
          await Promise.all([
            getMembers(),
            getProjects(),
            getTestimonials(),
            getGalleries(),
            getNews(),
          ]);

        setCounts({
          members: Array.isArray(members?.data)
            ? members.data.length
            : members.length || 0,
          projects: Array.isArray(projects)
            ? projects.length
            : projects?.data?.length || 0,
          testimonials: Array.isArray(testimonials)
            ? testimonials.length
            : testimonials?.data?.length || 0,
          gallery: Array.isArray(gallery)
            ? gallery.length
            : gallery?.data?.length || 0,
          news: Array.isArray(news)
            ? news.length
            : news?.data?.length || 0,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const cards = [
    { title: 'Members', value: counts.members, icon: <Users className="w-8 h-8 text-blue-600" />, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Projects', value: counts.projects, icon: <FolderKanban className="w-8 h-8 text-green-600" />, gradient: 'from-green-500 to-green-600' },
    { title: 'Testimonials', value: counts.testimonials, icon: <MessageSquare className="w-8 h-8 text-yellow-600" />, gradient: 'from-yellow-500 to-yellow-600' },
    { title: 'Gallery', value: counts.gallery, icon: <Image className="w-8 h-8 text-purple-600" />, gradient: 'from-purple-500 to-purple-600' },
    { title: 'News', value: counts.news, icon: <Newspaper className="w-8 h-8 text-red-600" />, gradient: 'from-red-500 to-red-600' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-10 font-poppins">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
              <h2 className="text-3xl font-semibold text-gray-800">{card.value}</h2>
            </div>
            <div
              className={`p-4 rounded-full bg-gradient-to-br ${card.gradient} text-white shadow-md`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
