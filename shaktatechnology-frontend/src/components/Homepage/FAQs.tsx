'use client';

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { getFaqs } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

const fallbackFaqs: Faq[] = [
  { id: 1, question: "What services do you offer?", answer: "We provide comprehensive digital solutions including web development, mobile apps, cloud services, and digital transformation consulting tailored to your business needs." },
  { id: 2, question: "How long does a typical project take?", answer: "Project timelines vary based on complexity. Simple websites take 2–4 weeks, while complex applications can take 3–6 months. We provide detailed timelines during our initial consultation." },
  { id: 3, question: "Do you provide ongoing support?", answer: "Yes, we offer comprehensive support and maintenance packages to ensure your digital solutions continue to perform optimally after launch." },
  { id: 4, question: "What technologies do you work with?", answer: "We work with modern technologies including React, Next.js, Node.js, Python, AWS, and more. We choose the best stack for your specific project requirements." },
  { id: 5, question: "How do you handle project communication?", answer: "We maintain regular communication through weekly updates, dedicated project management tools, and are always available for urgent queries via phone or email." },
  { id: 6, question: "What is your pricing structure?", answer: "We offer flexible pricing models including fixed-price projects, time-and-materials, and dedicated team options. We provide transparent quotes with no hidden costs." },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // single-open mode
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await getFaqs();
        const faqsData = data?.data || data || [];
        if (faqsData.length > 0) setFaqs(faqsData);
        else throw new Error("No FAQs available");
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

  const toggleItem = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFaqs = searchTerm ? filteredFaqs : filteredFaqs.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading FAQs...</p>
      </section>
    );
  }

  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Frequently Asked <span className="text-violet-600">Questions</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Got questions? We've got answers. Here are some of the most common ones we receive.
          </p>

          {error && (
            <p className="mt-4 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/30 inline-block px-4 py-2 rounded-lg">
              {error} (Showing demo FAQs)
            </p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 lg:space-y-6">
          {displayedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                layout
              >
                <button
                  className="w-full flex justify-between items-center text-left p-6 lg:p-8 font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-lg lg:text-xl pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-violet-600 dark:text-violet-400" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 lg:px-8 pb-6 lg:pb-8 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base lg:text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {searchTerm && filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find any FAQs matching your search.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors duration-200"
            >
              View All FAQs
            </button>
          </div>
        )}

        {/* View More Button */}
        {!searchTerm && faqs.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/faqs")}
              className="group inline-flex items-center px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all duration-200 transform hover:scale-105"
            >
              View All FAQs
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
