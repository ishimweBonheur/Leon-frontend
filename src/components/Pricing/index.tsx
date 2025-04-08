"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <SectionTitle
            title="Simple and Affordable Pricing"
            paragraph="Our transparent pricing structure is designed to meet your HR management needs without breaking the bank."
            center
            width="665px"
          />
        </motion.div>

        {/* Toggle Button (Monthly / Yearly) */}
        <motion.div
          className="w-full flex justify-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span
            onClick={() => setIsMonthly(true)}
            className={`${isMonthly ? "text-primary" : "text-dark dark:text-white"} 
            mr-4 cursor-pointer text-base font-semibold transition-all duration-300`}
          >
            Monthly
          </span>
          <div
            onClick={() => setIsMonthly(!isMonthly)}
            className="flex cursor-pointer items-center"
          >
            <div className="relative">
              <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
              <motion.div
                animate={{ x: isMonthly ? 0 : 24 }}
                className="absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center 
                rounded-full bg-primary transition-all duration-300"
              >
                <span className="h-4 w-4 rounded-full bg-white"></span>
              </motion.div>
            </div>
          </div>
          <span
            onClick={() => setIsMonthly(false)}
            className={`${isMonthly ? "text-dark dark:text-white" : "text-primary"} 
            ml-4 cursor-pointer text-base font-semibold transition-all duration-300`}
          >
            Yearly
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {[  
            { packageName: "Lite", price: isMonthly ? "40" : "120", duration: isMonthly ? "mo" : "yr", subtitle: "Ideal for small businesses and startups.", offers: [
                "Employee Self-Service Portal",
                "Basic Payroll Processing",
                "Leave & Absence Management",
                "Standard HR Reporting",
                "Email Support",
                "Advanced Analytics"
              ]
            },
            { packageName: "Basic", price: isMonthly ? "399" : "789", duration: isMonthly ? "mo" : "yr", subtitle: "Designed for growing companies.", offers: [
                "Comprehensive Employee Management",
                "Integrated Payroll & Benefits",
                "Attendance & Leave Tracking",
                "Performance Reviews",
                "Email & Chat Support",
                "Advanced HR Reporting"
              ]
            },
            { packageName: "Plus", price: isMonthly ? "589" : "999", duration: isMonthly ? "mo" : "yr", subtitle: "All-in-one HR management solution.", offers: [
                "Full HR Management Suite",
                "Automated Recruitment Tools",
                "Comprehensive Payroll & Benefits",
                "Advanced Analytics & Reporting",
                "24/7 Customer Support",
                "Free Lifetime Updates"
              ]
            }
          ].map((plan, index) => (
            <motion.div
              key={plan.packageName}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <PricingBox
                packageName={plan.packageName}
                price={plan.price}
                duration={plan.duration}
                subtitle={plan.subtitle}
              >
                {plan.offers.map((offer, i) => (
                  <OfferList key={i} text={offer} status={i < 5 ? "active" : "inactive"} />
                ))}
              </PricingBox>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background SVG */}
      <motion.div
        className="absolute bottom-0 left-0 z-[-1]"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <svg width="239" height="601" viewBox="0 0 239 601" fill="none">
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient id="paint0_linear_93:235" x1="-90.1184" y1="420.414" x2="-90.1184" y2="1131.65">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_93:235" x1="-159.441" y1="204.714" x2="-159.441" y2="915.952">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </section>
  );
};

export default Pricing;
