import React from "react";
import Container from "@/components/global/Container";


const HiringProcess = () => {
const steps = [
{ id: 1, title: "Application", desc: "Submit your resume and cover letter through our online portal." },
{ id: 2, title: "Screening", desc: "Initial phone/video call to discuss your experience and interests." },
{ id: 3, title: "Technical", desc: "Technical assessment or portfolio review relevant to the role." },
{ id: 4, title: "Final Interview", desc: "Meet the team and discuss how you'll contribute to our mission." },
];


return (
<Container className="py-12">
<div className="text-center mb-8">
<h3 className="text-2xl font-bold">Our Hiring <span className="text-indigo-600">Process</span></h3>
<p className="text-gray-600 mt-2">We've designed a straightforward process to help us get to know each other better.</p>
</div>


<div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
{steps.map((s) => (
<div key={s.id} className="bg-white p-6 rounded-lg border shadow-sm text-center">
<div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto font-bold text-indigo-600">{s.id}</div>
<h4 className="mt-4 font-semibold">{s.title}</h4>
<p className="text-sm text-gray-600 mt-2">{s.desc}</p>
</div>
))}
</div>
</Container>
);
};


export default HiringProcess;