'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTestimonial, updateTestimonial } from '@/lib/api';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
}

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  const id = parseInt(params.id as string);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const data = await getTestimonial(id);
        setTestimonial(data);
      } catch (err) {
        setError('Failed to fetch testimonial');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTestimonial();
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setError('');
      await updateTestimonial(id, formData);
      router.push('/admin/testimonials');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update testimonial');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) 
    return (
      <div className="p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading testimonial details...</p>
        </div>
      </div>
    );

  if (error && !testimonial) 
    return (
      <div className="text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 px-4 py-3 rounded m-4">
        {error}
      </div>
    );

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
                <Edit size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Testimonial</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Refine and update client feedback.</p>
             </div>
          </div>
        </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {testimonial && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700/50">
          <TestimonialForm 
            testimonial={testimonial}
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Update Testimonial"
          />
        </div>
      )}
      </div>
    </div>
  );
}
