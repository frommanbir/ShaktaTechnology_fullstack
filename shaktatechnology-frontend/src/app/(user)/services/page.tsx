"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getServices } from "@/lib/api";
import Link from "next/link";

interface Service {
  id: number;
  title: string;
  price?: string;
  description: string;
  features?: string[];
  technologies?: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        if (res.success) {
          setServices(res.data);
        } else {
          setError("Failed to load services.");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <main className="flex justify-center items-center h-[60vh] text-slate-600 dark:text-slate-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading services...
      </main>
    );
  }

  if (error) {
    return (
      <main className="text-center py-20 text-red-500 dark:text-red-400">
        {error}
      </main>
    );
  }

  if (services.length === 0) {
    return (
      <main className="text-center py-20 text-slate-600 dark:text-slate-300">
        No services found.
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 text-slate-900 dark:text-slate-100 pb-20">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center py-20"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold">
          Our <span className="text-indigo-600 dark:text-indigo-400">Services</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Comprehensive software development services designed to accelerate
          your business growth and digital transformation journey.
        </p>
      </motion.section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
              {service.price && (
                <p className="text-indigo-500 dark:text-indigo-400 font-medium mb-3">
                  {service.price}
                </p>
              )}
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <>
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 text-sm space-y-1 mb-4">
                    {service.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </>
              )}

              {service.technologies && service.technologies.length > 0 && (
                <>
                  <h4 className="font-semibold mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-200 mb-6">
                    {service.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 dark:bg-gray-700 px-3 py-1 rounded-full border border-slate-200 dark:border-gray-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link href="/contact" passHref>
              <button className="w-full mt-auto flex items-center justify-center gap-2 bg-indigo-500 dark:bg-indigo-400 text-white font-medium py-2 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition">
                Get Started <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-24 bg-gradient-to-r from-indigo-500/10 to-indigo-400/10 py-16 rounded-2xl mx-6"
      >
        <h3 className="text-2xl sm:text-3xl font-bold">
          Ready to Start Your Project?
        </h3>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" passHref>
            <button className="bg-indigo-500 dark:bg-indigo-400 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition">
              Get Free Consultation
            </button>
          </Link>
          <Link href="/projects" passHref>
            <button className="border border-slate-300 dark:border-gray-600 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition">
              View Our Work
            </button>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
