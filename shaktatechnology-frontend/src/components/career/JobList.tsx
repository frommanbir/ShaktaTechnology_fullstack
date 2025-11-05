"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
        if (Array.isArray(data)) {
          setCareers(data);
        } else {
          setCareers([]);
        }
      } catch (err) {
        console.error("Error fetching careers:", err);
        setError("Failed to load careers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  return (
    <motion.section
      className="py-16 bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Container>
        <motion.h2
          className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Open <span className="text-blue-400 dark:text-blue-500">Positions</span>
        </motion.h2>

        <motion.p
          className="text-gray-600 dark:text-gray-300 text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore exciting opportunities to grow your career with us.
        </motion.p>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading job listings...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {!loading && !error && careers.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No job openings available.
          </p>
        )}

        <div className="flex flex-col gap-6 mt-8">
          {careers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <JobCard career={career} />
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
};

export default JobList;
