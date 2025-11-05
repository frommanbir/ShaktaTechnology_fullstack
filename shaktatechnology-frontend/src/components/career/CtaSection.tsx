import React from "react";
import Container from "@/components/global/Container";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="bg-gray-900 py-12">
      <Container className="text-center">
        <h3 className="text-xl font-bold text-gray-100">
          Don't See the Right Role?
        </h3>
        <p className="text-gray-300 mt-2">
          Send us your resume and we'll reach out when something matches.
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4 flex-wrap">
          <a
            href="mailto:shaktatechnology@gmail.com"
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
          >
            Send Your Resume
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a
            href="/about"
            className="px-6 py-3 border border-gray-400 rounded-md text-gray-100 hover:bg-gray-800 transition"
          >
            Learn About Us
          </a>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;
