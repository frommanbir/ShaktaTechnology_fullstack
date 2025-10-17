import React, { ReactNode } from "react";

interface PropsType {
  title: ReactNode;
  desc: string;
}

const Heading = ({ title, desc }: PropsType) => {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 space-y-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold leading-tight">
        {title}
      </h1>
      <p className="max-w-2xl text-gray-600 text-sm sm:text-base lg:text-lg">
        {desc}
      </p>
    </section>
  );
};

export default Heading;

