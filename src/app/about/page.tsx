"use client";

import { useEffect, useState } from "react";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="animate-pulse px-4 py-10 mb-10">
          <div className="mt-20 h-8 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="mt-10 h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-600" />
          <div className="mt-8 h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-600" />
        </div>
      ) : (
        <Breadcrumb
          pageName="About Us"
          description="Discover how our HR management solutions can transform your business. We provide efficient tools and services for managing your workforce and optimizing HR operations."
        />
      )}

      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
