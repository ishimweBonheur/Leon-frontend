"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const SkeletonLine = () => (
  <div className="mb-5 h-6 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
);

const AboutSectionOne = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // simulate loading
    return () => clearTimeout(timeout);
  }, []);

  const List = ({ text }) =>
    loading ? <SkeletonLine /> : (
      <motion.p
        className="mb-5 flex items-center text-lg font-medium text-body-color"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
          {checkIcon}
        </span>
        {text}
      </motion.p>
    );

  return (
    <section id="about" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <motion.div
          className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <motion.div
                className="mb-12 max-w-[570px] lg:mb-0"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                {loading ? (
                  <>
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine />
                  </>
                ) : (
                  <SectionTitle
                    title="About Léon Services"
                    paragraph="At Léon Services, we are committed to empowering businesses by providing innovative workforce solutions. With a focus on professionalism, integrity, and efficiency, our services help businesses streamline HR processes, enhance employee performance, and ensure compliance with local and international regulations."
                    mb="44px"
                  />
                )}
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Professional Workforce Solutions" />
                    <List text="Ethical and Transparent Practices" />
                    <List text="Comprehensive Employee Support" />
                  </div>
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Commitment to Legal Compliance" />
                    <List text="Employee Development & Training" />
                    <List text="Workplace Diversity & Inclusion" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              {loading ? (
                <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700" />
              ) : (
                <motion.div
                  className="relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeIn", delay: 0.4 }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <Image
                    src="/images/about/about-image-2.svg"
                    alt="About Léon Services"
                    fill
                    className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
                  />
                  <Image
                    src="/images/about/about-image-dark.svg"
                    alt="About Léon Services Dark"
                    fill
                    className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
