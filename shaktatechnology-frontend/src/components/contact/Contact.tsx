"use client";

import { useState } from "react";
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const parseBudget = (budgetStr: string): number => {
    if (!budgetStr.trim()) return 0;
    const cleaned = budgetStr.replace(/[^\d]/g, '');
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

  return (
    <section className="py-20 bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Updated Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-md"
          >
            <h3 className="text-2xl font-semibold mb-2">Send us a message</h3>
            <p className="text-sm text-gray-500 mb-8">
              Fill out the form below and we’ll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Manbir"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Rai"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="+1 (555) 123-4567"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your Company Name"
                  value={form.company}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              {/* Service Interested In */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Interested In
                </label>
                <select
                  name="service_interested_in"
                  value={form.service_interested_in}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                >
                  <option value="">Select a service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>
                  <option value="Cloud Solutions">Cloud Solutions</option>
                  <option value="IoT Solutions">IoT Solutions</option>
                  <option value="Education Tech">Education Tech</option>
                </select>
              </div>

              {/* Project Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Budget
                </label>
                <input
                  type="text"
                  name="project_budget"
                  placeholder="e.g., $10,000"
                  value={form.project_budget}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>

          {/* Right: Keep Info Section As Is */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Let’s Start a Conversation
            </h3>
            <p className="text-gray-500 mb-6">
              We’re here to help you bring your ideas to life. Whether you need
              a new website, mobile app, or complete digital transformation, our
              team is ready to deliver exceptional results.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl shadow flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-gray-500">
                    info@shaktatechnology.com
                  </p>
                  <p className="text-sm text-gray-500">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM - 6PM PST</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-sm text-gray-500">Kulewhwor Awas Sadak</p>
                  <p className="text-sm text-gray-500">
                    Kuleshwor Kathmandu, Nepal
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-gray-500">
                    Mon - Fri: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}