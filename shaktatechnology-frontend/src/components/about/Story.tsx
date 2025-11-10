"use client";

import { motion } from "framer-motion";

export default function Story() {
  return (
    <section className="min-h-screen flex items-center py-32 sm:py-20 
                       bg-white dark:bg-gray-900 
                       text-gray-800 dark:text-gray-100 
                       transition-colors duration-300 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        {/* Animated Heading */}
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold 
                     text-gray-800 dark:text-gray-100"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our Story
        </motion.h2>

        {/* Animated Paragraphs */}
        <div className="mt-8 text-justify max-w-prose mx-auto space-y-6 
                        text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {[
            `Founded in 2014 by a group of passionate developers and entrepreneurs, ShaktaTechnology began with a simple yet powerful vision: to help businesses harness the power of technology to achieve their goals and transform their operations.`,
            `What started as a small team of five has grown into a diverse, talented group of 50+ professionals spanning multiple disciplines — from software development and cloud architecture to UI/UX design and project management. Our journey has been marked by continuous learning, adaptation, and an unwavering commitment to excellence.`,
            `Over the years, we’ve had the privilege of working with businesses of all sizes — from innovative startups to Fortune 500 companies — helping them navigate digital transformation, build custom software solutions, and achieve measurable results.`,
            `Today, we continue to push the boundaries of what’s possible, embracing emerging technologies like AI, IoT, and cloud computing to deliver solutions that not only meet today’s needs but anticipate tomorrow’s challenges.`,
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="transition-colors duration-300"
            >
              {text.includes("ShaktaTechnology") ? (
                <>
                  Founded in 2014 by a group of passionate developers and
                  entrepreneurs,{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    ShaktaTechnology
                  </span>{" "}
                  began with a simple yet powerful vision: to help businesses
                  harness the power of technology to achieve their goals and
                  transform their operations.
                </>
              ) : (
                text
              )}
            </motion.p>
          ))}
        </div>

        {/* Subtle Bottom Fade */}
        <motion.div
          className="mt-12 h-1 w-32 bg-gradient-to-r 
                     from-indigo-500 to-purple-500 
                     mx-auto rounded-full"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
      </div>
    </section>
  );
}
