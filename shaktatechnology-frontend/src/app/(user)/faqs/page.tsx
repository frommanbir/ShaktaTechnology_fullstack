"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Loader2, ArrowRight } from "lucide-react";
import { getFaqs } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

// Fallback FAQs
const fallbackFaqs: Faq[] = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "We provide web development, mobile app solutions, cloud integration, and digital transformation consulting tailored to your needs.",
  },
  {
    id: 2,
    question: "How long does a typical project take?",
    answer:
      "Timelines vary depending on complexity — small projects take 2–4 weeks, while larger ones can take 3–6 months.",
  },
  {
    id: 3,
    question: "Do you provide ongoing support?",
    answer:
      "Yes! We offer maintenance and support packages to ensure your products remain secure and up-to-date.",
  },
  {
    id: 4,
    question: "What technologies do you work with?",
    answer:
      "We use React, Next.js, Node.js, Python, AWS, and many modern frameworks to ensure performance and scalability.",
  },
  {
    id: 5,
    question: "How do you handle project communication?",
    answer:
      "We communicate regularly via email, project management tools, and weekly updates to keep you informed.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await getFaqs();
        const faqsData = data?.data || data || [];
        if (faqsData.length > 0) setFaqs(faqsData);
        else throw new Error("No FAQs found");
      } catch {
        setError("Unable to load FAQs. Showing demo data.");
        setFaqs(fallbackFaqs);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // Toggle question
  const toggleItem = useCallback((index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  }, []);

  // Loading UI
  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
        <p className="text-gray-600 dark:text-gray-300 mt-4">Loading FAQs...</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked{" "}
            <span className="text-violet-600 dark:text-violet-400">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3">
            Here are answers to some of the most common questions we get.
          </p>
          {error && (
            <p className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 inline-block mt-3 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center text-left p-6 font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                onClick={() => toggleItem(index)}
              >
                {faq.question}
                {openItems.has(index) ? (
                  <Minus className="text-violet-600 dark:text-violet-400 w-5 h-5" />
                ) : (
                  <Plus className="text-violet-600 dark:text-violet-400 w-5 h-5" />
                )}
              </button>

              {/* Animated Answer */}
              <AnimatePresence initial={false}>
                {openItems.has(index) && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16 border-t border-gray-200 dark:border-gray-700 pt-8"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Still have questions?
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="inline-flex items-center px-6 py-3 border-2 border-violet-600 dark:border-violet-500 text-violet-600 dark:text-violet-400 font-medium rounded-lg hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 transition-all"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
