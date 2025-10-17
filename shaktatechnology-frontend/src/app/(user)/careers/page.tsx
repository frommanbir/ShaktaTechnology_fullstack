import CtaSection from "@/components/career/CtaSection";
import Heading from "@/components/career/Heading";
import HiringProcess from "@/components/career/HiringProcess";
import JobList from "@/components/career/JobList";
import WhyChoose from "@/components/career/WhyChoose";

export default function ProjectsPage() {
  return (
    <div className="font-poppins">
      <Heading />
      <WhyChoose />
      <JobList />
      <HiringProcess />
      <CtaSection />
    </div>
  );
}
