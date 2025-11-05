"use client";

import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    import("@tsparticles/react").then(({ initParticlesEngine }) => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => setIsLoaded(true));
    });
  }, []);

  // Particle configuration
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        number: { value: 60 },
        color: { value: ["#6366f1", "#a855f7", "#06b6d4"] },
        links: {
          enable: true,
          color: "#94a3b8",
          distance: 120,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          outModes: { default: "out" as const }, // TypeScript safe
        },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: 0.6 },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 140, links: { opacity: 0.6 } },
          push: { quantity: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* Particle Background */}
      {isLoaded && (
        <Particles id="tsparticles" options={options} className="absolute inset-0 z-0" />
      )}

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-poppins font-bold leading-tight"
      >
        <span className="text-slate-900 dark:text-white">
          Transform Your <br /> Business with
        </span>{" "}
        <motion.span
          initial={{ backgroundPositionX: "100%" }}
          animate={{ backgroundPositionX: "0%" }}
          transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 dark:from-indigo-400 dark:to-violet-500"
          style={{ backgroundSize: "200% auto" }}
        >
          Cutting-
          <br />
          Edge Software
        </motion.span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="relative z-10 mt-4 max-w-2xl text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg"
      >
        We deliver innovative web solutions, mobile applications, and digital
        transformation services that drive growth and success for businesses
        worldwide.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delayChildren: 0.8, staggerChildren: 0.25 },
          },
        }}
        className="relative z-10 mt-6 flex flex-col sm:flex-row gap-4"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Link href="/contact">
            <button className="group flex items-center justify-center bg-primary dark:bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-violet-700 dark:hover:bg-indigo-500 transition-all duration-300">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Link href="/projects">
            <button className="group flex items-center justify-center border border-gray-300 dark:border-slate-600 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              Watch Demo
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
