'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Save, X, ImageIcon } from 'lucide-react';

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  text: string;
  image: string;
}

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  submitText: string;
}

export default function TestimonialForm({
  testimonial,
  onSubmit,
  loading,
  submitText
}: TestimonialFormProps) {
  const [preview, setPreview] = useState(testimonial?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }

    onSubmit(formData);
  };

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (testimonial?.image) {
      const url = testimonial.image.startsWith('http')
        ? testimonial.image
        : `${storageUrl}${testimonial.image}`;
      setPreview(url);
    }
  }, [testimonial, storageUrl]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={testimonial?.name}
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            placeholder="e.g. John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Role/Position *
          </label>
          <input
            type="text"
            name="role"
            defaultValue={testimonial?.role}
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            placeholder="e.g. CEO of Company"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          Testimonial Content *
        </label>
        <textarea
          name="text"
          defaultValue={testimonial?.text}
          required
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-serif resize-y"
          placeholder="What does our client say about us?..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
          Client Photo
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={24} className="mb-1 opacity-50" />
              </div>
            )}
          </div>
          <div className="flex-1 w-full relative">
            <input
              ref={fileInputRef}
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold text-gray-600 dark:text-gray-300 group max-w-sm"
            >
              <Camera size={18} className="group-hover:text-blue-500 transition-colors" />
              Select Profile Photo
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Recommended: Square image, transparent or solid background, minimum 200x200px.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-blue-500/20 font-bold"
        >
          {loading ? (
            <span className="flex items-center gap-2">Processing...</span>
          ) : (
            <>
              <Save size={18} />
              {submitText}
            </>
          )}
        </button>
      </div>
    </form>
  );
}