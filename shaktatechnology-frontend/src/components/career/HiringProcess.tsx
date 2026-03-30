"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/global/Container";

const HiringProcess = () => {
  const steps = [
    {
      id: 1,
      title: "Application",
      desc: "Submit your resume and cover letter through our online portal.",
    },
    {
      id: 2,
      title: "Screening",
      desc: "Initial phone/video call to discuss your experience and interests.",
    },
    {
      id: 3,
      title: "Technical",
      desc: "Technical assessment or portfolio review relevant to the role.",
    },
    {
      id: 4,
      title: "Final Interview",
      desc: "Meet the team and discuss how you'll contribute to our mission.",
    },
  ];

  return (
    <motion.section
      className="bg-white dark:bg-gray-900 py-4 transition-colors duration-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Our Hiring <span className="text-indigo-600 dark:text-indigo-400">Process</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            We've designed a straightforward, transparent process to help us get to know each other better.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, index) => (
            <motion.div
              key={s.id}
              className="relative bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Step number disc */}
              <motion.div
                className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto font-bold text-indigo-600 dark:text-indigo-400 text-xl border-4 border-white dark:border-gray-800 shadow-sm group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 10 }}
              >
                {s.id}
              </motion.div>
              
              <h4 className="mt-6 font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {s.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                {s.desc}
              </p>

              {/* Connecting line or indicator for desktop */}
              {index < steps.length - 1 && (
                 <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-gray-200 dark:bg-gray-700" />
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
};

export default HiringProcess;
