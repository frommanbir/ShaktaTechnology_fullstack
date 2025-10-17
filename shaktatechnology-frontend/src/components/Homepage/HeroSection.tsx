import { ArrowRight, Play } from "lucide-react";
import Heading from "../global/Heading";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 space-y-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold leading-tight">
        Transform Your<br />
        Business with{" "}
        <span className="text-primary">
          Cutting-<br />
          Edge Software
        </span>
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600 text-sm sm:text-base lg:text-lg">
        We deliver innovative web solutions, mobile applications, and digital
        transformation services that drive growth and success for businesses
        worldwide.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Link href = "/contact" passHref>
        <button className="group flex items-center justify-center bg-primary text-white px-5 py-3 rounded-xl shadow hover:bg-violet-700 transition">
          Get Started Today
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        </Link>

        <Link href = "/projects" passHref>
        <button className="group flex items-center justify-center border px-5 py-3 rounded-xl hover:bg-gray-100 transition">
          <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          Watch Demo
        </button>
        </Link>
      </div>
    </section>
  );
}
