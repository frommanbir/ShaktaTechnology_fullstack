'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { createTestimonial } from '@/lib/api';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AddTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setError('');
      await createTestimonial(formData);
      router.push('/admin/testimonials');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Testimonials
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl text-blue-600 dark:text-blue-400">
                <UserPlus size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add Testimonial</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new client testimonial to display on the site.</p>
             </div>
          </div>
        </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700/50">
          <TestimonialForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Publish Testimonial"
          />
        </div>
      </div>
    </div>
  );
}
