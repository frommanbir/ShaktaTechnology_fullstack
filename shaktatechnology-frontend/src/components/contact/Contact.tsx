"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createContact } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company: "",
    service_interested_in: "",
    project_budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const parseBudget = (budgetStr: string): number => {
    if (!budgetStr.trim()) return 0;
    const cleaned = budgetStr.replace(/[^\d]/g, "");
    return parseInt(cleaned) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      name: `${form.first_name.trim()} ${form.last_name.trim()}`,
      Company_name: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone_number.replace(/[^\d+]/g, ""),
      services: form.service_interested_in,
      budget: parseBudget(form.project_budget),
      project_details: form.message.trim(),
    };

    try {
      await createContact(submitData);
      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
        variant: "default",
      });

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        company: "",
        service_interested_in: "",
        project_budget: "",
        message: "",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error!",
        description:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    {
      icon: Mail,
      title: "Email Us",
      lines: ["info@shaktatechnology.com", "We'll respond within 24 hours"],
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: ["+1 (555) 123-4567", "Mon-Fri 9AM - 6PM PST"],
    },
    {
      icon: MapPin,
      title: "Visit Us",
      lines: ["Kulewhwor Awas Sadak", "Kuleshwor Kathmandu, Nepal"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      lines: [
        "Mon - Fri: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  return (
    <motion.section
      className="py-20 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT - Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-2">Send us a message</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Fill out the form below and we’ll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["first_name", "last_name"].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      placeholder={field === "first_name" ? "Manbir" : "Rai"}
                      value={form[field as keyof typeof form]}
                      onChange={handleChange}
                      required
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-400"
                    />
                  </div>
                ))}
              </div>

              {/* Email, Phone, Company, etc. */}
              {[
                { name: "email", placeholder: "email@example.com", type: "email" },
                { name: "phone_number", placeholder: "+1 (555) 123-4567", type: "text" },
                { name: "company", placeholder: "Your Company Name", type: "text" },
              ].map((input, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {input.name.replace("_", " ")}
                  </label>
                  <input
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={form[input.name as keyof typeof form]}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-400"
                  />
                </div>
              ))}

              {/* Service Interested In */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Interested In
                </label>
                <select
                  name="service_interested_in"
                  value={form.service_interested_in}
                  onChange={handleChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-400"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Cloud Solutions">Cloud Solutions</option>
                  <option value="IoT Solutions">IoT Solutions</option>
                  <option value="Education Tech">Education Tech</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium mb-1">Project Budget</label>
                <input
                  type="text"
                  name="project_budget"
                  placeholder="e.g., $10,000"
                  value={form.project_budget}
                  onChange={handleChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us about your project requirements..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-400"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </div>
          </motion.form>

          {/* RIGHT - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">
              Let’s Start a Conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We’re here to help you bring your ideas to life. Whether you need
              a new website, mobile app, or complete digital transformation, our
              team is ready to deliver exceptional results.
            </p>

            <div className="space-y-4">
              {infoItems.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={idx}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium">{info.title}</p>
                      {info.lines.map((line, i) => (
                        <p key={i} className="text-sm text-gray-500 dark:text-gray-400">
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
