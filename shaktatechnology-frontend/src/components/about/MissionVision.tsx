"use client";

import { Target, Eye } from "lucide-react"; 
import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="font-bold text-center bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Our Mission</h2>
          </div>
          <p className="mt-4 text-gray-800 dark:text-gray-300 leading-relaxed">
            To empower businesses of all sizes with cutting-edge software solutions that
            drive growth, efficiency, and innovation. We believe technology should be
            accessible, reliable, and transformative for every organization we serve.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Our Vision</h2>
          </div>
          <p className="mt-4 text-gray-800 dark:text-gray-300 leading-relaxed">
            To be the global leader in software development and digital transformation,
            known for our innovative solutions, exceptional client relationships, and
            positive impact on businesses worldwide.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
