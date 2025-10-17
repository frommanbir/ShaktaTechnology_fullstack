"use client";

import { Target, Eye } from "lucide-react"; // Mission = Target, Vision = Eye

export default function MissionVision() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        
        {/* Mission */}
        <div>
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
          </div>
          <p className="mt-4 text-slate-600 leading-relaxed">
            To empower businesses of all sizes with cutting-edge software solutions that
            drive growth, efficiency, and innovation. We believe technology should be
            accessible, reliable, and transformative for every organization we serve.
          </p>
        </div>

        {/* Vision */}
        <div>
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
          </div>
          <p className="mt-4 text-slate-600 leading-relaxed">
            To be the global leader in software development and digital transformation,
            known for our innovative solutions, exceptional client relationships, and
            positive impact on businesses worldwide.
          </p>
        </div>

      </div>
    </section>
  );
}
