"use client";

import { useState, useEffect } from "react";
import { getProjects } from "@/lib/api";
import Image from "next/image";
import { Loader2 } from "lucide-react";

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
    async function fetchProjects() {
      setLoading(true);
      try {
        const response = await getProjects();
        const sortedProjects = (response.data || []).sort(
          (a: Project, b: Project) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        // Take only latest 3 projects
        setProjects(sortedProjects.slice(0, 3));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold">
        Recent <span className="text-violet-600">Projects</span>
      </h2>
      <p className="mt-2 text-gray-600">
        Check out some of our latest work and see how we’ve helped businesses
        <br />
        transform digitally.
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-10 w-10 text-violet-600" />
        </div>
      ) : error ? (
        <p className="text-red-600 mt-6">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-600 mt-6">No projects available.</p>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
            >
              {project.image ? (
                <Image
                  src={`${storageUrl}projects/${project.image}`}
                  alt={project.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl mb-4">
                  No Image
                </div>
              )}
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-gray-600 mt-2 line-clamp-3">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        className="mt-8 px-5 py-3 border rounded-xl hover:bg-gray-100"
        onClick={() => (window.location.href = "/projects")}
      >
        View All Projects
      </button>
    </section>
  );
}
