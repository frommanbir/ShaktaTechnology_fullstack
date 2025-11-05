'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTestimonials, deleteTestimonial } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    '';

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError('Failed to fetch testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete testimonial');
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 dark:text-indigo-400" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 dark:text-red-400 p-4 text-center">{error}</div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Testimonials</h1>
        <Link
          href="/admin/testimonials/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Add Testimonial
        </Link>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-300">
              <th className="py-3 px-4 border-b">Image</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Role</th>
              <th className="py-3 px-4 border-b">Testimonial</th>
              <th className="py-3 px-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr
                key={testimonial.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-3 px-4 border-b">
                  <div className="relative w-10 h-10">
                    <Image
                      src={
                        testimonial.image
                          ? testimonial.image.startsWith('http')
                            ? testimonial.image
                            : `${storageUrl}${testimonial.image}`
                          : '/images/placeholder-avatar.jpg'
                      }
                      alt={testimonial.name}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="py-3 px-4 border-b font-medium text-gray-900 dark:text-gray-100">
                  {testimonial.name}
                </td>
                <td className="py-3 px-4 border-b text-gray-600 dark:text-gray-300">
                  {testimonial.role}
                </td>
                <td className="py-3 px-4 border-b text-gray-700 dark:text-gray-200 max-w-md truncate">
                  {testimonial.text}
                </td>
                <td className="py-3 px-4 border-b text-right">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No testimonials found.{' '}
          <Link
            href="/admin/testimonials/add"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Add the first one
          </Link>
        </div>
      )}
    </div>
  );
}
