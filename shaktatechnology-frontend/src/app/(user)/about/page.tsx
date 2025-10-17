import React from 'react'
import MissionVision from "@/components/about/MissionVision";
import Numbers from "@/components/about/Numbers";
import Values from "@/components/about/Values";
import Team from "@/components/about/Team";
import Story from "@/components/about/Story";
import Heading from '@/components/about/Heading';

export default function AboutPage() {
  return (
    <div className="font-poppins">
      <Heading />
      <MissionVision />
      <Numbers />
      <Values />
      <Team />
      <Story />
    </div>
  );
}
