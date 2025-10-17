import Heading from '@/components/global/Heading';

export default function Home() {
  return (
    <div>
      <Heading 
        title={
          <>
            About<br />
            <span className="text-blue-600">ShaktaTechnology</span>
          </>
        }
        desc="Empowering businesses worldwide with innovative software solutions and digital transformation services since 2014."
      />
    </div>
  );
}
