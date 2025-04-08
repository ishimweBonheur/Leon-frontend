import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page ",
  description: " ",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
            pageName="About Us"
            description="Discover how our HR management solutions can transform your business. We provide efficient tools and services for managing your workforce and optimizing HR operations."
          />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
