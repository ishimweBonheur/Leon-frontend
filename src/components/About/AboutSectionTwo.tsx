"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          {/* Image Section with Scroll Animation */}
          <div className="w-full px-4 lg:w-1/2">
            <motion.div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <Image
                src="/images/about/about-image-2.svg"
                alt="workforce management"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/about-image-2-dark.svg"
                alt="workforce management"
                fill
                className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
              />
            </motion.div>
          </div>

          {/* Text Content with Slide-in Effect */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              {[
                {
                  title: "Flexible Workforce Placement",
                  text: "Léon Services helps businesses by providing qualified, ready-to-employ workers tailored to their needs. Whether for short-term or long-term assignments, we ensure your staffing requirements are met efficiently.",
                },
                {
                  title: "Comprehensive Employee Management",
                  text: "We handle all aspects of personnel administration, including contracts, attendance, payroll, and legal compliance, providing businesses with peace of mind while they focus on growth.",
                },
                {
                  title: "Tailored Training and Support",
                  text: "Léon Services offers tailored training to strengthen your employees' skills and ensures continuous monitoring to maintain high performance, leading to long-term success for both businesses and employees.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="mb-9"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: index * 0.2,
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
