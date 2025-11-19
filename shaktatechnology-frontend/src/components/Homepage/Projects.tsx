"use client";

import { useState, useEffect } from "react";
import { getProjects } from "@/lib/api";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  created_at: string;
}

export default function UserProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      console.log("API projects:", response.data); // <-- log the data
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchProjects();
}, []);

  return (
    <section className="py-16 text-center transition-colors duration-300 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Animated heading */}
      <motion.h2
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Recent{" "}
        <span className="text-violet-600 dark:text-violet-400">Projects</span>
      </motion.h2>

      <motion.p
        className="mt-2 text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Check out some of our latest work and see how we’ve helped businesses
        <br />
        transform digitally.
      </motion.p>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-10 w-10 text-violet-600 dark:text-violet-400" />
        </div>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400 mt-6">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 mt-6">
          No projects available.
        </p>
      ) : (
        <motion.div
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow hover:shadow-lg dark:hover:shadow-slate-700/50 transition-all duration-300 p-6 border border-slate-100 dark:border-slate-700"
              whileHover={{ scale: 1.03 }}
            >
              {project.image ? (
                <Image
                  src={`${project.image}`}
                  alt={project.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 rounded-2xl mb-4">
                  No Image
                </div>
              )}
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                {project.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.button
        className="mt-8 px-5 py-3 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => (window.location.href = "/projects")}
      >
        View All Projects
      </motion.button>
    </section>
  );
}
