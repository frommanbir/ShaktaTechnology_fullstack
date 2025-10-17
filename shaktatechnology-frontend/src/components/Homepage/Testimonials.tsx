'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTestimonials } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image?: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Use centralized storage URL if you store images remotely
  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    '';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);

        // fallback to local/static data
        setReviews([
          {
            id: 1,
            name: 'Sarah Johnson',
            role: 'CEO of TechCorp',
            text: 'ShaktaTechnology transformed our online digital infrastructure. Their expertise exceeded expectations.',
            image: '/images/sarah.jpg',
          },
          {
            id: 2,
            name: 'Mitchell Chan',
            role: 'Product Manager at StartupX',
            text: 'The mobile app they developed was a game-changer. Engagement increased by 300% within 3 months.',
            image: '/images/mitchell.jpg',
          },
          {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'CIO at InnovateSoft',
            text: 'Professional, reliable, and innovative. Delivered projects on time and within budget.',
            image: '/images/emily.jpg',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 text-center font-poppins">
      <h2 className="text-3xl font-bold">
        What Our <span className="text-violet-600">Clients Say</span>
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
        Don't just take our word for it. Here's what our clients have to say about<br />
        working with us.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col hover:shadow-lg transition-all duration-300"
          >
            <p className="text-gray-600 mb-4">"{r.text}"</p>

            <div className="flex items-center mt-4">
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={
                    r.image
                      ? r.image.startsWith('http')
                        ? r.image
                        : `${storageUrl}${r.image}`
                      : '/images/placeholder-avatar.jpg'
                  }
                  alt={r.name}
                  fill
                  sizes="48px"
                  className="rounded-full object-cover"
                />
              </div>

              <div className="text-left">
                <h4 className="font-semibold">{r.name}</h4>
                <p className="text-sm text-gray-500">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
