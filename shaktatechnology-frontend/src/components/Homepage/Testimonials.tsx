'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTestimonials } from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  role: string;
}

// Fallback testimonials removed as per user request


export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

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

  const paginate = useCallback((newDirection: 'next' | 'prev') => {
    if (reviews.length <= 1) return;
    setDirection(newDirection);
    setCurrent((prev) =>
      newDirection === 'next'
        ? (prev + 1) % reviews.length
        : (prev - 1 + reviews.length) % reviews.length
    );
  }, [reviews.length]);

  const goToIndex = useCallback((index: number) => {
    if (index === current || reviews.length <= 1) return;
    setDirection(index > current ? 'next' : 'prev');
    setCurrent(index);
  }, [current, reviews.length]);

  // Auto-slide
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => paginate('next'), 6000);
    return () => clearInterval(interval);
  }, [reviews.length, paginate]);

  if (loading)
    return (
      <section className="py-28 flex justify-center items-center bg-gray-50 dark:bg-slate-950 min-h-[600px] transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
      </section>
    );

  if (reviews.length === 0) return null;

  const currentTestimonial = reviews[current];

  const variants = {
    enter: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-slate-950 text-center font-poppins relative overflow-hidden min-h-[600px] flex items-center transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          What Our <span className="text-violet-600 dark:text-violet-400">Clients Say</span>
        </h2>

        <p className="mt-2 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl mb-12">
          Don't just take our word for it. Here's what our clients have to say about working with us.
        </p>


        {/* Arrows */}
        {reviews.length > 1 && (
          <div className="hidden lg:flex justify-between items-center absolute left-0 right-0 top-1/2 transform -translate-y-1/2 px-4 z-10">
            <button onClick={() => paginate('prev')} className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700">
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
            <button onClick={() => paginate('next')} className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700">
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        )}

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentTestimonial.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 xl:p-12 flex flex-col items-center gap-6 border border-slate-100 dark:border-slate-700"
            >
              <h3 className="font-semibold text-2xl text-gray-900 dark:text-gray-100">{currentTestimonial.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-base lg:text-lg mt-1">{currentTestimonial.role}</p>
              <p className="text-gray-700 dark:text-gray-300 text-lg lg:text-xl italic mt-4 max-w-3xl">{currentTestimonial.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === idx ? 'bg-violet-600 dark:bg-violet-400 scale-110' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
