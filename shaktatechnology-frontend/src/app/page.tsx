import Herosection from '@/components/Homepage/HeroSection'
import Projects from '@/components/Homepage/Projects'
import Services from '@/components/Homepage/Services'
import Stats from '@/components/Homepage/Stats'
import Testimonials from '@/components/Homepage/Testimonials'
import FAQ from '@/components/Homepage/FAQs'
import News from '@/components/Homepage/News'
import React from 'react'

const page = () => {
  return (
    <main className="font-sans text-gray-800">
      <Herosection />
      <Stats />
      <Services />
      <Projects />
      <Testimonials />
      <FAQ />
      <News />
    </main>
  )
}

export default page