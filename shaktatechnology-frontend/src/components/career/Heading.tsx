import Heading from '@/components/global/Heading';

export default function Home() {
  return (
    <div>
      <Heading 
        title={
          <>
            Join Our <span className="text-blue-600">Amazing<br></br>Team</span>
          </>
        }
        desc="Build the future of software development with a team that values innovation, collaboration, and personal growth."
      />
    </div>
  );
}
