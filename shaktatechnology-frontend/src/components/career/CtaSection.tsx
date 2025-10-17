import React from "react";
import Container from "@/components/global/Container";
import { ArrowRight } from "lucide-react";


const CtaSection = () => {
return (
<Container className="py-12 text-center">
<h3 className="text-xl font-bold">Don't See the Right Role?</h3>
<p className="text-gray-600 mt-2">Send us your resume and we'll reach out when something matches.</p>
<div className="mt-6 flex items-center justify-center space-x-4">
<a
  href="mailto:shaktatechnology@gmail.com"
  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
>
  Send Your Resume
  <ArrowRight className="ml-2 w-5 h-5" />
</a>
<a href="/about" className="px-6 py-3 border rounded-md">Learn About Us</a>
</div>
</Container>
);
};


export default CtaSection;