"use client";

import React from "react";
import { Briefcase, MapPin, DollarSign, Clock, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Career {
  id: number;
  title: string;
  department?: string;
  location?: string;
  type: string;
  salary?: string;
  description?: string;
  requirements?: string | null;
  benefits?: string | null;
}

const JobCard: React.FC<{ career: Career }> = ({ career }) => {
  const [copied, setCopied] = React.useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("info@shaktatechnology.com");
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: Job Info */}
        <div className="flex-1">
          {/* Department Tag */}
          <div className="flex items-center mb-2 text-xs font-medium px-3 py-1 rounded-full w-fit bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
            <Briefcase className="w-3 h-3 mr-1" />
            {career.department || "Engineering"}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{career.title}</h3>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {career.location || "Remote"}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-400" />
              {career.type}
            </div>
            {career.salary && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                {career.salary}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {/* Description */}
            {career.description && (
              <div 
                className="rich-text-content text-gray-700 dark:text-gray-300 text-sm leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: career.description }} 
              />
            )}

            {/* Requirements & Benefits */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {career.requirements && (
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Requirements:</h4>
                  <div 
                    className="rich-text-content text-sm text-gray-600 dark:text-gray-300" 
                    dangerouslySetInnerHTML={{ __html: career.requirements }} 
                  />
                </div>
              )}

              {career.benefits && (
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Benefits:</h4>
                  <div 
                    className="rich-text-content text-sm text-gray-600 dark:text-gray-300" 
                    dangerouslySetInnerHTML={{ __html: career.benefits }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[140px]">
          <a
            href={`mailto:info@shaktatechnology.com?subject=Application for ${career.title} position`}
            className="w-full text-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm hover:shadow-md"
          >
            Apply Now
          </a>
          <button
            onClick={copyEmail}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            title="Copy email to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
