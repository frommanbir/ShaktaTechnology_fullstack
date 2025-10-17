import Heading from '@/components/global/Heading';

export default function Home() {
  return (
    <div>
      <Heading 
        title={
          <>
            Our<span className="text-blue-600"> Gallery</span>
          </>
        }
        desc="Explore our visual journey through innovative projects, creative solutions, and memorable moments"
      />
    </div>
  );
}
