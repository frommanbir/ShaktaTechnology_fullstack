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
      <div id="overview"><Heading /></div>
      <div id="mission"><MissionVision /></div>
      <div id="impact"><Numbers /></div>
      <div id="values"><Values /></div>
      <div id="team"><Team /></div>
      <div id="story"><Story /></div>
    </div>
  );
}
