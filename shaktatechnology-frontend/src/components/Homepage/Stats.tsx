"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

export default function Stats() {
  const data = [
    { value: 500, label: "Projects Completed" },
    { value: 200, label: "Happy Clients" },
    { value: 10, label: "Years Experience" },
    { value: 50, label: "Team Members" },
  ];

  // Variants for container (stagger children)
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  // Variants for each stat card
  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", // ✅ TypeScript-safe
        bounce: 0.4,
        duration: 0.7,
      },
    },
  };

  return (
    <section className="py-16 text-center px-4 bg-gray-50 dark:bg-slate-900">
      <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-white">
        Trusted by industry leaders worldwide
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl">
        Our track record speaks for itself
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
      >
        {data.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-md p-8 cursor-pointer transition-transform duration-300"
          >
            <AnimatedNumber value={stat.value} />
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// Count-up animation for numbers
function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200; // 1.2 seconds
    const stepTime = Math.max(Math.floor(duration / end), 1);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-violet-600">
      {count}+
    </h3>
  );
}
