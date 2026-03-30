"use client";

import { Target, Eye } from "lucide-react"; 
import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="relative bg-white/70 dark:bg-gray-800/40 p-10 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-xl backdrop-blur-md overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic">
            "To empower businesses of all sizes with cutting-edge software solutions that
            drive growth, efficiency, and innovation. We believe technology should be
            accessible, reliable, and transformative for every organization we serve."
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="relative bg-white/70 dark:bg-gray-800/40 p-10 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-xl backdrop-blur-md overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30">
              <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Our Vision</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic">
            "To be the global leader in software development and digital transformation,
            known for our innovative solutions, exceptional client relationships, and
            positive impact on businesses worldwide."
          </p>
        </motion.div>

      </div>
    </section>
  );
}