"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMembers } from "@/lib/api";
import { Linkedin, Github, Facebook, Instagram } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role?: string;
  position?: string;
  department?: string;
  short_description?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getMembers(1, 50);
        const members: TeamMember[] = (res.data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role || "-",
          position: m.position || "",
          department: m.department || "",
          short_description: m.short_description || "",
          image: m.image ? `${m.image}` : "",
          linkedin: m.linkedin,
          github: m.github,
          facebook: m.facebook,
          instagram: m.instagram,
        }));
        setTeam(members);
      } catch (err) {
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 py-20 text-center transition-colors duration-300">
        <p className="text-gray-700 dark:text-gray-300 text-lg animate-pulse">
          Loading team members...
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-20 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Meet Our Team
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate minds powering innovation and excellence behind our organization.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.04, y: -5 }}
              className="group bg-gray-100 dark:bg-gray-800/60 
                         rounded-2xl shadow-md 
                         hover:shadow-indigo-500/20 
                         border border-gray-300 dark:border-gray-700 
                         hover:border-indigo-400 
                         transition-all duration-300 
                         overflow-hidden backdrop-blur-sm cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full h-60 overflow-hidden">
                {member.image ? (
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-4xl font-semibold text-gray-600 dark:text-gray-300">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                {/* Overlay Socials */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4"
                >
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition"
                    >
                      <Linkedin size={22} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition"
                    >
                      <Github size={22} />
                    </a>
                  )}
                  {member.facebook && (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition"
                    >
                      <Facebook size={22} />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-pink-400 transition"
                    >
                      <Instagram size={22} />
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  {member.position || member.role}
                </p>
                {member.department && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {member.department}
                  </p>
                )}
                {member.short_description && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {member.short_description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
