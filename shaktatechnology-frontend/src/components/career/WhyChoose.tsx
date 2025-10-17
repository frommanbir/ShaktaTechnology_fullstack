"use client";

import { Heart, GraduationCap, Coffee, Users } from "lucide-react";

const reasons = [
  {
    title: "Health & Wellness",
    desc: "Comprehensive health, dental, and vision insurance for you and your family.",
    icon: Heart,
  },
  {
    title: "Learning & Growth",
    desc: "Annual learning budget for conferences, courses, and skill development.",
    icon: GraduationCap,
  },
  {
    title: "Work–Life Balance",
    desc: "Flexible hours, remote work options, and generous vacation policy.",
    icon: Coffee,
  },
  {
    title: "Team Culture",
    desc: "Collaborative environment with regular team events and celebrations.",
    icon: Users,
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Why Choose <span className="text-indigo-600">ShaktaTechnology</span>?
        </h2>
        <p className="text-lg text-slate-600 mb-12">
          We believe in creating an environment where everyone can thrive and do their best work.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center">
                <item.icon className="w-10 h-10 text-indigo-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600">
                {item.title}
              </h3>
              <p className="mt-3 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
