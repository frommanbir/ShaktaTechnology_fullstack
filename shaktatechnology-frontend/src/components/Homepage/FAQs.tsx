"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { getFaqs } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqs();
        setFaqs(data.data || data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p>Loading FAQs...</p>
      </section>
    );
  }

  const displayedFaqs = faqs.slice(0, 6);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold">
        Frequently Asked <span className="text-violet-600">Questions</span>
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
        Got questions? We've got answers. Here are some of the most common <br className="hidden sm:inline" /> questions we receive.
      </p>

      <div className="mt-8 max-w-2xl mx-auto text-left space-y-4">
        {displayedFaqs.map((faq, i) => (
          <div key={faq.id} className="border-b py-3">
            <button
              className="w-full flex justify-between items-center text-left font-medium text-gray-800 hover:text-violet-600 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      {faqs.length > 6 && (
        <div className="mt-6">
          <button
            onClick={() => router.push("/faqs")} // FAQ page route
            className="inline-flex items-center px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            More queries
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </section>
  );
}
