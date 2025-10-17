import Heading from '@/components/global/Heading';

export default function Home() {
  return (
    <div>
      <Heading 
        title={
          <>
            Our <span className="text-blue-600">Projects</span>
          </>
        }
        desc="Explore our portfolio of successful projects that showcase our expertise and commitment to delivering exceptional results."
      />
    </div>
  );
}
