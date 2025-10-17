"use client";

export default function Story() {
  return (
    <section className="bg-white min-h-screen flex items-center py-32 sm:py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Our Story
        </h2>

        <div className="mt-8 text-justify max-w-prose mx-auto space-y-6 text-slate-600 text-lg leading-relaxed">
          <p>
            Founded in 2014 by a group of passionate developers and entrepreneurs,
            <span className="font-semibold text-slate-800">
              {" "}ShaktaTechnology
            </span>{" "}
            began with a simple yet powerful vision: to help businesses harness
            the power of technology to achieve their goals and transform their
            operations.
          </p>

          <p>
            What started as a small team of five has grown into a diverse,
            talented group of 50+ professionals spanning multiple disciplines —
            from software development and cloud architecture to UI/UX design and
            project management. Our journey has been marked by continuous
            learning, adaptation, and an unwavering commitment to excellence.
          </p>

          <p>
            Over the years, we’ve had the privilege of working with businesses
            of all sizes — from innovative startups to Fortune 500 companies —
            helping them navigate digital transformation, build custom software
            solutions, and achieve measurable results.
          </p>

          <p>
            Today, we continue to push the boundaries of what’s possible,
            embracing emerging technologies like AI, IoT, and cloud computing to
            deliver solutions that not only meet today’s needs but anticipate
            tomorrow’s challenges.
          </p>
        </div>
      </div>
    </section>
  );
}
