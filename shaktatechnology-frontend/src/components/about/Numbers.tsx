"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { label: "Years in Business", value: 10, suffix: "+" },
  { label: "Projects Completed", value: 500, suffix: "+" },
  { label: "Happy Clients", value: 200, suffix: "+" },
  { label: "Team Members", value: 50, suffix: "+" },
  { label: "Countries Served", value: 25, suffix: "+" },
  { label: "Technologies Mastered", value: 50, suffix: "+" },
];

export default function Numbers() {
  return (
    <section className="py-20 font-poppins bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4 text-gray-800 dark:text-white"
        >
          Our Journey in Numbers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg text-gray-700 dark:text-gray-300 mb-12"
        >
          A decade of excellence, innovation, and client success
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((stat, i) => (
            <AnimatedStat key={i} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({
  value,
  label,
  suffix,
  delay,
}: {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.08 }}
      className="group cursor-pointer p-4 rounded-xl 
                 bg-gray-100 dark:bg-gray-800 
                 hover:bg-gray-200 dark:hover:bg-gray-700 
                 border border-gray-300 dark:border-gray-700 
                 hover:border-indigo-400 transition-all duration-300 
                 shadow-sm hover:shadow-indigo-500/20"
    >
      <CountUp target={value} suffix={suffix} />
      <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
        {label}
      </p>
    </motion.div>
  );
}

function CountUp({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = target;
    const duration = 1500; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (ref.current) {
        ref.current.textContent =
          Math.floor(start).toString() + (suffix ?? "");
      }
      if (start >= end) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [target, suffix]);

  return (
    <p className="text-4xl font-extrabold text-indigo-500 dark:text-indigo-400">
      <span ref={ref}>0</span>
    </p>
  );
}
