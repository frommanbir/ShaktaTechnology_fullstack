export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "CEO of TechCorp",
      text: "ShaktaTechnology transformed our online digital infrastructure. Their expertise exceeded expectations.",
      image: "/images/sarah.jpg",
    },
    {
      name: "Mitchell Chan",
      role: "Product Manager at StartupX",
      text: "The mobile app they developed was a game-changer. Engagement increased by 300% within 3 months.",
      image: "/images/mitchell.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "CIO at InnovateSoft",
      text: "Professional, reliable, and innovative. Delivered projects on time and within budget.",
      image: "/images/emily.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 text-center font-poppins">
      <h2 className="text-3xl font-bold">
        What Our <span className="text-violet-600">Clients Say</span>
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
        Don't just take our word for it. Here's what our clients have to say about<br />working with us
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.map((r) => (
          <div key={r.name} className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <p className="text-gray-600 mb-4">“{r.text}”</p>
            <div className="flex items-center mt-4">
              <img
                src={r.image}
                alt={r.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="text-left">
                <h4 className="font-semibold">{r.name}</h4>
                <p className="text-sm text-gray-500">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
