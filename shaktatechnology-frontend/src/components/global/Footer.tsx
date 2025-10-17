"use client";

import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold">
            <span className="text-purple-500">Shakta</span>
            <span className="text-gray-900">Technology</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Empowering businesses with cutting-edge software solutions and
            digital transformation services.
          </p>
          <div className="flex space-x-4 mt-4 text-gray-600">
            <a href="#" className="hover:text-purple-500">
              <Twitter size={22} />
            </a>
            <a href="#" className="hover:text-purple-500">
              <Linkedin size={22} />
            </a>
            <a href="#" className="hover:text-purple-500">
              <Github size={22} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="/sevices" className="hover:text-purple-500">Services</a></li>
            <li><a href="/projects" className="hover:text-purple-500">Projects</a></li>
            <li><a href="/about" className="hover:text-purple-500">About</a></li>
            <li><a href="/careers" className="hover:text-purple-500">Careers</a></li>
            <li><a href="/faqs" className="hover:text-purple-500">FAQs</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="/sevices" className="hover:text-purple-500">Web Development</a></li>
            <li><a href="/sevices" className="hover:text-purple-500">Mobile Apps</a></li>
            <li><a href="/sevices" className="hover:text-purple-500">Cloud Solutions</a></li>
            <li><a href="/sevices" className="hover:text-purple-500">Digital Transformation</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Contact Info</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-purple-500" />
              info@shaktatechnology.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-purple-500" />
              +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-purple-500" />
              123 Tech Street, Silicon Valley, CA
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t text-center py-4 text-gray-500 text-sm">
        © 2024 ShaktaTechnology. All rights reserved.
      </div>
    </footer>
  );
}
