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
  // Accept either an array (preferred) or a string (CMS sometimes returns this)
  requirements?: string[] | string | null;
  benefits?: string[] | string | null;
}

const normalizeToArray = (val?: string[] | string | null): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val
    .split(/\r?\n|;|\||•|·|,/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const JobCard: React.FC<{ career: Career }> = ({ career }) => {
  const requirements = normalizeToArray(career.requirements);
  const benefits = normalizeToArray(career.benefits);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        {/* Left: Job Info */}
        <div className="flex-1">
          {/* Department Tag */}
          <div className="flex items-center mb-2">
            <span className="flex items-center text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
              <Briefcase className="w-3 h-3 mr-1" />
              {career.department || "Engineering"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900">{career.title}</h3>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
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

          {/* Description */}
          {career.description && (
            <p className="mt-3 text-gray-700 text-sm leading-relaxed">{career.description}</p>
          )}

          {/* Requirements & Benefits */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requirements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Requirements:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {requirements.map((req, i) => (
                    <li key={`${i}-${req.slice(0, 20)}`}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {benefits.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Benefits:</h4>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit, i) => (
                    <span
                      key={`${i}-${benefit.slice(0, 20)}`}
                      className="px-3 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Apply Button */}
        <div className="ml-6">
          <a
            href={`/apply/${career.id}`}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
