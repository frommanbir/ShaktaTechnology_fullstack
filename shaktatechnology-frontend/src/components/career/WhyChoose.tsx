"use client";

import { Heart, GraduationCap, Coffee, Users } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    title: "Health & Wellness",
    desc: "Comprehensive health, dental, and vision insurance for you and your family.",
    icon: Heart,
  },
  {
    title: "Learning & Growth",
    desc: "Annual learning budget for conferences, courses, and skill development.",
    icon: GraduationCap,
  },
  {
    title: "Work–Life Balance",
    desc: "Flexible hours, remote work options, and generous vacation policy.",
    icon: Coffee,
  },
  {
    title: "Team Culture",
    desc: "Collaborative environment with regular team events and celebrations.",
    icon: Users,
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{opacity:1, y:0}}
        transition={{ duration:0.6}}
        viewport={{ once:true}}
        className="text-3xl font-bold text-slate-900 dark:text-white">
          Why Choose <span className="text-indigo-600 dark:text-indigo-400">ShaktaTechnology </span>?
        </motion.h2>
        <motion.p
        initial={{ opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{ delay: 0.2, duration: 0.6}}
        viewport={{ once:true}}
        className="text-lg text-slate-600 dark:text-gray-300 mb-12">
          We believe in creating an environment where everyone can thrive and do their best work.
        </motion.p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{opacity:1, y:0}}
                transition={{ delay: index * 0.1, duration: 0.6}}
                whileHover={{ scale: 1.05}}
                viewport={{ once: true}}
                className="bg-slate-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-center">
                  <Icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-gray-300">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
