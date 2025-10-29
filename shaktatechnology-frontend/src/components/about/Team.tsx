"use client";

import { useEffect, useState } from "react";
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
          image: m.image ? `${storageUrl}members/${m.image}` : "",
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
      <section className="bg-slate-50 py-20 text-center">
        <p className="text-gray-500 text-lg">Loading team members...</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900">Meet Our Team</h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Passionate minds powering innovation and excellence behind our organization.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {team.map((member) => (
            <div
              key={member.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            >
              {/* Image */}
              <div className="relative w-full h-60 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-4xl font-semibold text-gray-600">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                {/* Overlay Socials */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400"
                    >
                      <Linkedin size={22} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300"
                    >
                      <Github size={22} />
                    </a>
                  )}
                  {member.facebook && (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400"
                    >
                      <Facebook size={22} />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-pink-400"
                    >
                      <Instagram size={22} />
                    </a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-sm font-medium">
                  {member.position || member.role}
                </p>
                {member.department && (
                  <p className="text-gray-500 text-sm mt-1">{member.department}</p>
                )}
                {member.short_description && (
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {member.short_description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
