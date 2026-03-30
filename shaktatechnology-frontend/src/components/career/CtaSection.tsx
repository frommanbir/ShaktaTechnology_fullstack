"use client";

import React, { useState } from "react";
import Container from "@/components/global/Container";
import { ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const CtaSection = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("info@shaktatechnology.com");
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-gray-900 py-12">
      <Container className="text-center">
        <h3 className="text-xl font-bold text-gray-100">
          Don't See the Right Role?
        </h3>
        <p className="text-gray-300 mt-2">
          Send us your resume and we'll reach out when something matches.
        </p>

        {/* FIXED BUTTON WRAPPER */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="mailto:info@shaktatechnology.com?subject=Resume Submission"
              className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition w-full sm:w-auto"
            >
              Send Your Resume
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <button
              onClick={copyEmail}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-md hover:bg-gray-700 transition w-full sm:w-auto"
              title="Copy email to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Email Copied!" : "Copy Email"}
            </button>
          </div>

          <a
            href="/about"
            className="w-full sm:w-auto px-6 py-3 border border-gray-400 rounded-md text-gray-100 hover:bg-gray-800 transition text-center"
          >
            Learn About Us
          </a>
        </div>
      </Container>
    </section>
  );
};

export default CtaSection;