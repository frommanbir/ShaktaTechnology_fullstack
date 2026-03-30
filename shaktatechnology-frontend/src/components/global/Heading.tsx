"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface PropsType {
  title: ReactNode;
  desc: string;
}

const Heading = ({ title, desc }: PropsType) => {
  return (
    // <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white">
    <section className="relative py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-400 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-64 h-64 bg-purple-400 blur-[100px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-poppins font-black leading-[1.1] tracking-tight mb-8">
          {title}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
        >
          {desc}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Heading;
