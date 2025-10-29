"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ArrowRight, Plus, Minus, Loader2 } from "lucide-react";
import { getFaqs } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

// Fallback FAQs in case API fails
const fallbackFaqs: Faq[] = [
  {
    id: 1,
    question: "What services do you offer?",
    answer: "We provide comprehensive digital solutions including web development, mobile apps, cloud services, and digital transformation consulting tailored to your business needs."
  },
  {
    id: 2,
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our initial consultation."
  },
  {
    id: 3,
    question: "Do you provide ongoing support?",
    answer: "Yes, we offer comprehensive support and maintenance packages to ensure your digital solutions continue to perform optimally after launch."
  },
  {
    id: 4,
    question: "What technologies do you work with?",
    answer: "We work with modern technologies including React, Next.js, Node.js, Python, AWS, and more. We choose the best stack for your specific project requirements."
  },
  {
    id: 5,
    question: "How do you handle project communication?",
    answer: "We maintain regular communication through weekly updates, dedicated project management tools, and are always available for urgent queries via phone or email."
  },
  {
    id: 6,
    question: "What is your pricing structure?",
    answer: "We offer flexible pricing models including fixed-price projects, time-and-materials, and dedicated team options. We provide transparent quotes with no hidden costs."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch FAQs with error handling
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFaqs();
        
        // Handle different response structures
        const faqsData = data?.data || data || [];
        
        if (faqsData.length > 0) {
          setFaqs(faqsData);
        } else {
          throw new Error("No FAQs available");
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setError("Unable to load FAQs at this time");
        setFaqs(fallbackFaqs);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Toggle FAQ item with animation support
  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(index);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % displayedFaqs.length;
      toggleItem(nextIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + displayedFaqs.length) % displayedFaqs.length;
      toggleItem(prevIndex);
    }
  }, [toggleItem]);

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFaqs = searchTerm ? filteredFaqs : filteredFaqs.slice(0, 6);

  // Loading state
  if (loading) {
    return (
      <section 
        className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-50"
        aria-label="Loading FAQs"
      >
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mb-12"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mt-8" />
          <p className="text-gray-600 mt-4">Loading FAQs...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked <span className="text-violet-600">Questions</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-base sm:text-lg lg:text-xl">
            Got questions? We've got answers. Here are some of the most common questions we receive.
          </p>

          {error && (
            <div className="mt-4 max-w-2xl mx-auto" role="alert">
              <p className="text-amber-600 text-sm bg-amber-50 inline-block px-4 py-2 rounded-lg">
                {error} (Showing demo FAQs)
              </p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 lg:mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              aria-label="Search frequently asked questions"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
            {filteredFaqs.length === 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-violet-600 hover:text-violet-700 underline mt-2"
              >
                Clear search and show all FAQs
              </button>
            )}
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-4 lg:space-y-6">
          {displayedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center text-left p-6 lg:p-8 font-semibold text-gray-900 hover:text-violet-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-inset rounded-xl"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
              >
                <span className="text-lg lg:text-xl pr-4">{faq.question}</span>
                <div className="flex-shrink-0 ml-4">
                  {openItems.has(index) ? (
                    <Minus className="w-5 h-5 lg:w-6 lg:h-6 text-violet-600 transition-transform duration-300" />
                  ) : (
                    <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-violet-600 transition-transform duration-300" />
                  )}
                </div>
              </button>
              
              <div
                id={`faq-answer-${faq.id}`}
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openItems.has(index) 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                  <div className="border-t border-gray-100 pt-4 lg:pt-6">
                    <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {searchTerm && filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any FAQs matching your search.</p>
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              View All FAQs
            </button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="text-center mt-12 lg:mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="inline-flex items-center px-6 py-3 border-2 border-violet-600 text-violet-600 font-medium rounded-lg hover:bg-violet-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}