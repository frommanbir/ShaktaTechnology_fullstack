'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTestimonials } from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  role: string;
  image: string | null;
  image_url: string | null;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestimonials();
        if (data && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Unable to load testimonials at this time');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const paginate = useCallback(
    (newDirection: 'next' | 'prev') => {
      if (reviews.length <= 1) return;
      setDirection(newDirection);
      setCurrent((prev) =>
        newDirection === 'next'
          ? (prev + 1) % reviews.length
          : (prev - 1 + reviews.length) % reviews.length
      );
    },
    [reviews.length]
  );

  const goToIndex = useCallback(
    (index: number) => {
      if (index === current || reviews.length <= 1) return;
      setDirection(index > current ? 'next' : 'prev');
      setCurrent(index);
    },
    [current, reviews.length]
  );

  // Auto-slide — pauses on hover
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;
    const interval = setInterval(() => paginate('next'), 6000);
    return () => clearInterval(interval);
  }, [reviews.length, paginate, isPaused]);

  if (loading) {
    return (
      <section className="py-28 flex justify-center items-center bg-gray-50 dark:bg-slate-950 min-h-[600px] transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
      </section>
    );
  }

  if (error || reviews.length === 0) return null;

  const currentTestimonial = reviews[current];

  const variants = {
    enter: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
    },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-slate-950 text-center font-poppins relative overflow-hidden min-h-[600px] flex items-center transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          What Our{' '}
          <span className="text-violet-600 dark:text-violet-400">Clients Say</span>
        </h2>

        <p className="mt-2 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl mb-12">
          Don&apos;t just take our word for it. Here&apos;s what our clients have to say about
          working with us.
        </p>

        {/* Slider area */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Arrow buttons — only on lg+ */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={() => paginate('prev')}
                aria-label="Previous testimonial"
                className="hidden lg:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={() => paginate('next')}
                aria-label="Next testimonial"
                className="hidden lg:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            </>
          )}

          {/*
           * Fixed-height overflow-hidden wrapper.
           * This gives AnimatePresence a stable bounding box so the exiting card
           * and entering card can overlap without affecting page layout.
           * Adjust the height values to suit your longest testimonial text.
           */}
          <div className="relative overflow-hidden mx-auto max-w-4xl h-[320px] sm:h-[300px] lg:h-[280px]">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={currentTestimonial.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                // other inside the fixed-height wrapper instead of stacking vertically.
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl px-8 py-8 xl:px-12 flex flex-col items-center justify-center gap-4 border border-slate-100 dark:border-slate-700"
              >

                <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg lg:text-xl italic max-w-3xl leading-relaxed">
                  {currentTestimonial.text}
                </p>

                {/* Author */}
                <div className={`flex items-center gap-3 mt-2 ${currentTestimonial.image_url ? '' : 'flex-col'}`}>
                  {currentTestimonial.image_url && (
                    <img
                      src={currentTestimonial.image_url}
                      alt={currentTestimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-800 flex-shrink-0"
                    />
                  )}
                  <div className={currentTestimonial.image_url ? 'text-left' : 'text-center'}>
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 leading-tight">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile swipe hint arrows */}
          {reviews.length > 1 && (
            <div className="flex lg:hidden justify-center gap-4 mt-6">
              <button
                onClick={() => paginate('prev')}
                aria-label="Previous testimonial"
                className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={() => paginate('next')}
                aria-label="Next testimonial"
                className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  current === idx
                    ? 'w-6 h-3 bg-violet-600 dark:bg-violet-400'
                    : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}