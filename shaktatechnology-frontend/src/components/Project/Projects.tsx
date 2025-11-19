"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import Image from "next/image";
import Container from "@/components/global/Container";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  client: string;
  duration: string;
  category: string;
  description: string;
  technologies: string[];
  key_results: string[];
  image?: string;
  created_at?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut" as const,
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <Container>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0px 8px 20px rgba(139, 92, 246, 0.15)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 transition-transform"
              >
                {/* Image Display */}
                {project.image ? (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500 dark:text-gray-300 text-sm">
                      No Image
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <span className="inline-block text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Client: {project.client} • Duration: {project.duration}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-4 overflow-auto">
                  {project.description}
                </p>

                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-1">
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-1">
                    Key Results:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    {project.key_results.map((result, idx) => (
                      <li key={idx}>{result}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
