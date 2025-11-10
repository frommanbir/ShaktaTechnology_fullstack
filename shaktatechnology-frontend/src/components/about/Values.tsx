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
    <section className="bg-white dark:bg-gray-900 py-20 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Animated Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, duration: 0.6 },
            },
          }}
          className="text-center mb-14"
        >
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Our <span className="text-indigo-500 dark:text-indigo-400">Values</span>
          </motion.h2>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-lg text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto"
          >
            The principles that guide everything we do and every decision we make.
          </motion.p>
        </motion.div>

        {/* Value Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 8px 20px rgba(99, 102, 241, 0.25)",
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="group bg-gray-100 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-indigo-400 transition-all shadow-md hover:shadow-indigo-500/20 backdrop-blur-sm cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex justify-center"
                >
                  <Icon className="w-10 h-10 text-indigo-500 dark:text-indigo-400 mb-4 group-hover:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors" />
                </motion.div>

                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
                  {v.title}
                </h3>

                <p className="mt-3 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
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
