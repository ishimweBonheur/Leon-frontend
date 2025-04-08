import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | HR Management System",
  description: "Get in touch with us for inquiries, support, or more information about our HR management solutions.",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Us"
        description="Have questions or need assistance? Reach out to our team for any inquiries regarding our HR management services. We're here to help you streamline your HR processes."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
