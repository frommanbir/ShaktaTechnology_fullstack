"use client";

import { Lightbulb, CheckCircle, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    title: "Innovation",
    desc: "We embrace cutting-edge technologies and creative solutions to solve complex challenges.",
    icon: Lightbulb,
  },
  {
    title: "Quality",
    desc: "We never compromise on quality, delivering robust and reliable software solutions.",
    icon: CheckCircle,
  },
  {
    title: "Collaboration",
    desc: "We work closely with our clients as partners to achieve exceptional results together.",
    icon: Users,
  },
  {
    title: "Integrity",
    desc: "We build trust through transparency, honesty, and ethical business practices.",
    icon: Shield,
  },
];

export default function Values() {
  return (
    <section className="bg-gray-900 py-20 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-100"
        >
          Our <span className="text-indigo-400">Values</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-300 mb-12"
        >
          The principles that guide everything we do and every decision we make.
        </motion.p>

        {/* Value Cards */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className="group bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-indigo-400 transition-all shadow-md hover:shadow-indigo-500/20 backdrop-blur-sm cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex justify-center"
                >
                  <Icon className="w-10 h-10 text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors" />
                </motion.div>

                <h3 className="text-xl font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  {v.title}
                </h3>

                <p className="mt-3 text-gray-300 group-hover:text-gray-200 transition-colors">
                  {v.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
