import Heading from '@/components/global/Heading';

export default function Home() {
  return (
    <div>
      <Heading 
        title={
          <>
            Latest <span className="text-blue-600">News & Updates</span>
          </>
        }
        desc="Stay informed about our latest developments, partnerships, achievements, and industry insights."
      />
    </div>
  );
}
