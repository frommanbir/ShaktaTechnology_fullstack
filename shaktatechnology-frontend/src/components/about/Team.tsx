"use client";

import { useEffect, useState } from "react";
import { getMembers } from "@/lib/api";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image?: string;
}

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getMembers(1, 10); // fetch first 10 members
        const members: TeamMember[] = (res.data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.position || m.role || "-",
          image: m.image ? `${storageUrl}members/${m.image}` : "",
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
        <p>Loading team members...</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900">Meet Our Team</h2>
        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
              <h3 className="mt-4 text-lg font-semibold text-slate-800">{member.name}</h3>
              <p className="text-slate-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
