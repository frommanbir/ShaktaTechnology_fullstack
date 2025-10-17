'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { createTestimonial } from '@/lib/api';

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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Testimonial</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <TestimonialForm 
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Testimonial"
      />
    </div>
  );
}