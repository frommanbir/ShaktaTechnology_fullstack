'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { getTestimonial, updateTestimonial } from '@/lib/api';

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
    return <div className="flex justify-center p-8 text-gray-700 dark:text-gray-200">Loading...</div>;

  if (error && !testimonial) 
    return (
      <div className="text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 px-4 py-3 rounded m-4">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Edit Testimonial</h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {testimonial && (
        <TestimonialForm 
          testimonial={testimonial}
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Update Testimonial"
        />
      )}
    </div>
  );
}
