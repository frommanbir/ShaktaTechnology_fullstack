"use client";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showLayout, setShowLayout] = useState(true);

  useEffect(() => {
    if (pathname.includes("admin")) {
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
  }, [pathname]);

  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
}
