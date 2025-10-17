"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import Image from "next/image"; // Add this import
import Container from "@/components/global/Container";
import { Loader2 } from "lucide-react";

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

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || '';

  return (
    <section className="py-20 bg-gray-50">
      <Container>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
              >
                {/* Image Display */}
                {project.image ? (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={`${storageUrl}projects/${project.image}`}
                      alt={project.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to a placeholder on error
                        e.currentTarget.src = "/placeholder-image.jpg"; // Add a default image to public/
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}

                <div className="mb-4">
                  <span className="inline-block text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Client: {project.client} • Duration: {project.duration}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-4 overflow-auto">{project.description}</p>

                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-800 mb-1">
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-800 mb-1">
                    Key Results:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    {project.key_results.map((result, idx) => (
                      <li key={idx}>{result}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}