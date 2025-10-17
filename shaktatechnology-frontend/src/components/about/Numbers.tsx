"use client";

const stats = [
  { label: "Years in Business", value: "10+" },
  { label: "Projects Completed", value: "500+" },
  { label: "Happy Clients", value: "200+" },
  { label: "Team Members", value: "50+" },
  { label: "Countries Served", value: "25+" },
  { label: "Technologies Mastered", value: "50+" },
];

export default function Numbers() {
  return (
    <section className="bg-slate-100 py-20 font-poppins">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Our Journey in Numbers
        </h2>
        <p className="text-lg text-slate-600 mb-12">
          A decade of excellence, innovation, and client success
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-extrabold text-indigo-500">{stat.value}</p>
              <p className="mt-2 text-slate-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
