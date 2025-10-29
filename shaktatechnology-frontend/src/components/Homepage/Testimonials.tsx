'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTestimonials } from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  role: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO of TechCorp',
    text: 'ShaktaTechnology transformed our online digital infrastructure. Their expertise exceeded expectations and delivered outstanding results for our business.',
  },
  {
    id: 2,
    name: 'Mitchell Chan',
    role: 'Product Manager at StartupX',
    text: 'The mobile app they developed was a complete game-changer. User engagement increased by 300% within just 3 months of launch.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'CIO at InnovateSoft',
    text: 'Professional, reliable, and consistently innovative. They delivered all projects on time and within budget while maintaining excellent communication.',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'CTO at GlobalTech',
    text: 'Outstanding technical expertise and project management. The team was responsive and delivered beyond our expectations.',
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestimonials();

        if (data && data.length > 0) {
          setReviews(data);
        } else {
          throw new Error('No testimonials found');
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setError('Unable to load testimonials at this time');
        setReviews(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = useCallback(() => {
    if (reviews.length <= 1 || animating) return;
    setAnimating(true);
    setDirection('next');
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
      setAnimating(false);
    }, 300);
  }, [reviews.length, animating]);

  const prevTestimonial = useCallback(() => {
    if (reviews.length <= 1 || animating) return;
    setAnimating(true);
    setDirection('prev');
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
      setAnimating(false);
    }, 300);
  }, [reviews.length, animating]);

  const goToTestimonial = useCallback(
    (index: number) => {
      if (index === current || animating) return;
      const newDirection = index > current ? 'next' : 'prev';
      setDirection(newDirection);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [current, animating]
  );

  // Auto slide
  useEffect(() => {
    if (reviews.length <= 1) return;
    const intervalId = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(intervalId);
  }, [reviews.length, nextTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevTestimonial();
      else if (e.key === 'ArrowRight') nextTestimonial();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextTestimonial, prevTestimonial]);

  if (loading) {
    return (
      <section className="py-28 flex justify-center items-center bg-gray-50 min-h-[600px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-28 bg-gray-50 text-center min-h-[600px] flex items-center justify-center">
        <div>
          <h2 className="text-4xl font-bold">
            What Our <span className="text-violet-600">Clients Say</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            No testimonials available at the moment.
          </p>
        </div>
      </section>
    );
  }

  const currentTestimonial = reviews[current];

  return (
    <section
      className="py-20 lg:py-28 bg-gray-50 text-center font-poppins relative overflow-hidden min-h-[600px] flex items-center"
      aria-label="Client testimonials"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            What Our <span className="text-violet-600">Clients Say</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-base sm:text-lg lg:text-xl">
            Don't just take our word for it. Here's what our clients have to say
            about working with us.
          </p>

          {error && (
            <div className="mt-4 max-w-2xl mx-auto" role="alert">
              <p className="text-amber-600 text-sm bg-amber-50 inline-block px-4 py-2 rounded-lg">
                {error} (Showing demo testimonials)
              </p>
            </div>
          )}
        </div>

        {/* Navigation Arrows - Desktop */}
        {reviews.length > 1 && (
          <div className="hidden lg:flex justify-between items-center absolute left-0 right-0 top-1/2 transform -translate-y-1/2 px-4 z-10">
            <button
              onClick={prevTestimonial}
              disabled={animating}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={nextTestimonial}
              disabled={animating}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}

        {/* Main testimonial card */}
        <div className="relative">
          <div
            key={currentTestimonial.id}
            className={`w-full max-w-4xl mx-auto bg-white rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl p-6 lg:p-8 xl:p-12 flex flex-col items-center gap-6 transition-all duration-500 ease-in-out
              ${
                animating
                  ? direction === 'next'
                    ? 'opacity-0 translate-x-12 lg:translate-x-24'
                    : 'opacity-0 -translate-x-12 lg:-translate-x-24'
                  : 'opacity-100 translate-x-0'
              }`}
          >
            {/* Client Info */}
            <div className="text-center">
              <h3 className="font-semibold text-xl lg:text-2xl text-gray-900">
                {currentTestimonial.name}
              </h3>
              <p className="text-gray-500 text-sm lg:text-base mt-1">
                {currentTestimonial.role}
              </p>
            </div>

            {/* Testimonial text */}
            <div className="text-gray-700 text-base lg:text-lg xl:text-xl italic leading-relaxed lg:leading-loose relative max-w-3xl">
              <div className="hidden lg:block absolute -top-4 -left-2 text-6xl text-violet-100 font-serif leading-none">
                "
              </div>
              <blockquote className="relative z-10">
                "{currentTestimonial.text}"
              </blockquote>
              <div className="hidden lg:block absolute -bottom-8 -right-2 text-6xl text-violet-100 font-serif leading-none rotate-180">
                "
              </div>
            </div>
          </div>

          {/* Dots navigation + counter */}
          {reviews.length > 1 && (
            <div className="relative mt-8 lg:mt-12">
              <div className="flex justify-center gap-3">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    disabled={animating}
                    className={`w-3 h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                      ${
                        current === index
                          ? 'bg-violet-600 scale-110'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                {current + 1} / {reviews.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
