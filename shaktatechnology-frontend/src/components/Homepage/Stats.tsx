export default function Stats() {
  const data = [
    { value: "500+", label: "Projects Completed" },
    { value: "200+", label: "Happy Clients" },
    { value: "10+", label: "Years Experience" },
    { value: "50+", label: "Team Members" },
  ];

  return (
    <section className="py-12 text-center px-4">
      <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">
        Trusted by industry leaders worldwide
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
        Our track record speaks for itself
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {data.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-violet-600">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
