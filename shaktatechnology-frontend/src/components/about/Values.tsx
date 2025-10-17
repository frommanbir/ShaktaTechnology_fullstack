"use client";

import { Lightbulb, CheckCircle, Users, Shield } from "lucide-react"; 

const values = [
  { 
    title: "Innovation", 
    desc: "We embrace cutting-edge technologies and creative solutions to solve complex challenges.",
    icon: Lightbulb 
  },
  { 
    title: "Quality", 
    desc: "We never compromise on quality, delivering robust and reliable software solutions.",
    icon: CheckCircle 
  },
  { 
    title: "Collaboration", 
    desc: "We work closely with our clients as partners to achieve exceptional results together.",
    icon: Users 
  },
  { 
    title: "Integrity", 
    desc: "We build trust through transparency, honesty, and ethical business practices.",
    icon: Shield 
  },
];

export default function Values() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Our <span className="text-blue-600">Values</span>
        </h2>
        <p className="text-lg text-slate-600 mb-12">
          The principles that guide everything we do and every decision we make.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center">
                <v.icon className="w-10 h-10 text-indigo-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600">{v.title}</h3>
              <p className="mt-3 text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
