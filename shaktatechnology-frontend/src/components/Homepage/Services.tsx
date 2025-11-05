"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getServices } from "@/lib/api";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

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

  if (loading)
    return (
      <main className="text-center py-20 text-slate-600 dark:text-slate-300">
        Loading services...
      </main>
    );

  if (error)
    return (
      <main className="text-center py-20 text-red-500 dark:text-red-400">
        {error}
      </main>
    );

  if (services.length === 0)
    return (
      <main className="text-center py-20 text-slate-600 dark:text-slate-300">
        No services found.
      </main>
    );

  // Motion variants
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 0.7 } },
  };

  return (
    <main className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      {/* Header Section */}
      <motion.section
        className="text-center py-20 px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold">
          Our <span className="text-indigo-500 dark:text-indigo-400">Services</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
          Comprehensive software development services designed to accelerate your business growth and digital transformation journey.
        </p>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        {services.slice(0, 3).map((service) => (
          <motion.div
            key={service.id}
            variants={item}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1">{service.title}</h3>

              {service.price && (
                <p className="text-indigo-500 dark:text-indigo-400 font-medium mb-3">{service.price}</p>
              )}

              <p className="text-slate-600 dark:text-slate-300 mb-4">{service.description}</p>

              {service.features && service.features.length > 0 && (
                <>
                  <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Key Features:</h4>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 text-sm space-y-1 mb-4">
                    {service.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </>
              )}

              {service.technologies && service.technologies.length > 0 && (
                <>
                  <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Technologies:</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
                    {service.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link href="/contact" passHref>
              <button className="w-full mt-auto flex items-center justify-center gap-2 bg-indigo-500 dark:bg-indigo-600 text-white font-medium py-2 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition">
                Get Started <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="text-center mt-24 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-2xl sm:text-3xl font-bold">Ready to Start Your Project?</h3>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" passHref>
            <button className="bg-indigo-500 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition">
              Get Free Consultation
            </button>
          </Link>

          <Link href="/projects" passHref>
            <button className="border border-slate-300 dark:border-slate-600 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-800 dark:text-slate-200">
              View Our Work
            </button>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
