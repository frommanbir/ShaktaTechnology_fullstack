import Heading from '@/components/global/Heading';

export default function Home() {
  return (
    <div>
      <Heading 
        title={
          <>
            Get In <span className="text-blue-400">Touch</span>
          </>
        }
        desc="Ready to transform your business? Let’s discuss your project and explore how we can help you achieve your goals."
      />
    </div>
  );
}
