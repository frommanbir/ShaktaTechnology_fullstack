"use client";

import React, { useEffect, useState } from "react";
import Container from "../global/Container";
import JobCard from "../global/JobCard";
import { getCareers } from "@/lib/api";

interface Career {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  experience: string;
  salaryRange?: string;
  type: string;
  createdAt?: string;
}

const JobList: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const data = await getCareers();
        setCareers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err);
        setError("Failed to load careers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-8">
          Open <span className="text-blue-400">Positions</span>
        </h2>
        <p className="text-gray-600 mt-2 text-center">Explore exciting opportunities to grow your career with us.</p>

        {loading && (
          <p className="text-center text-gray-500">Loading job listings...</p>
        )}

        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {!loading && !error && careers.length === 0 && (
          <p className="text-center text-gray-500">No job openings available.</p>
        )}

        <div className="flex flex-col gap-6 mt-8">
          {careers.map((c) => (
            <JobCard key={c.id} career={c} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default JobList;
