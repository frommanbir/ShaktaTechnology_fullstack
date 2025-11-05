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
      className="bg-gray-900 py-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Container>
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-100">
            Our Hiring <span className="text-indigo-500">Process</span>
          </h3>
          <p className="text-gray-300 mt-2">
            We've designed a straightforward process to help us get to know each other better.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {steps.map((s, index) => (
            <motion.div
              key={s.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-sm text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto font-bold text-indigo-600"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                {s.id}
              </motion.div>
              <h4 className="mt-4 font-semibold text-gray-100">{s.title}</h4>
              <p className="text-sm text-gray-300 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
};

export default HiringProcess;
