import React from "react";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

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
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-6">
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

        {/* Right: Apply Button */}
        <div className="flex-shrink-0">
          <a
            href={`mailto:info@shaktatechnology.com?subject=Application for ${encodeURIComponent(career.title)}&body=Dear Hiring Team,%0D%0A%0D%0AI am interested in applying for the ${encodeURIComponent(career.title)} position.%0D%0A%0D%0A[Your message here]%0D%0A%0D%0ARegards,%0D%0A[Your Name]`}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition inline-block"
          >
            Apply Now
          </a>
        </div>
      </div>

      <style jsx global>{`
        .rich-text-content ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0.25rem 0;
        }
        .rich-text-content ol {
          list-style: decimal;
          padding-left: 1.25rem;
          margin: 0.25rem 0;
        }
        .rich-text-content li {
          margin-bottom: 0.125rem;
        }
        .rich-text-content p {
          margin-bottom: 0.5rem;
        }
        .rich-text-content strong {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default JobCard;
