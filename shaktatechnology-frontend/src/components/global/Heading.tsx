"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface PropsType {
  title: ReactNode;
  desc: string;
}

const Heading = ({ title, desc }: PropsType) => {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold leading-tight"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once:true, amount:0.4}}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl text-sm sm:text-base lg:text-lg"
      >
        {desc}
      </motion.p>
    </section>
  );
};

export default Heading;
