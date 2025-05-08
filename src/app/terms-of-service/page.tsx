"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";

const TermsOfService = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return (
    <section className="relative z-10 overflow-hidden pt-28 lg:pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 md:w-8/12 lg:w-7/12">
            <div className="mb-8 max-w-[570px] md:mb-0 lg:mb-12">
              <h1 className="mb-5 text-3xl font-bold text-black dark:text-white sm:text-4xl leading-tight">
                Terms of Service
              </h1>
              <p className="text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                Last Updated: 25 March 2025
              </p>
              <p className="mt-4 text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                By using Léon Services, you agree to comply with our terms and conditions.
                These terms govern the use of our website, services, and interactions with
                our platform.
              </p>
            </div>
          </div>
          
          <div className="w-full px-4 md:w-4/12 lg:w-5/12">
            <div className="text-end">
              <ul className="flex items-center md:justify-end">
                <li className="flex items-center">
                  <Link
                    href="/"
                    className="pr-1 text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Home
                  </Link>
                  <span className="mr-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-gray-700 dark:border-gray-300"></span>
                </li>
                <li className="text-base font-medium text-primary dark:text-primary">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Background - Render only in the browser */}
      {isBrowser && (
        <div>
          <span className="absolute left-0 top-0 z-[-1]">
            <svg
              width="287"
              height="254"
              viewBox="0 0 287 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.1"
                d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
                fill="url(#paint0_linear_111:578)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_111:578"
                  x1="-40.5"
                  y1="117"
                  x2="301.926"
                  y2="-97.1485"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="absolute right-0 top-0 z-[-1]">
            <svg
              width="628"
              height="258"
              viewBox="0 0 628 258"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.1"
                d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
                fill="url(#paint0_linear_0:1)"
              />
              <path
                opacity="0.1"
                d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
                fill="url(#paint1_linear_0:1)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_0:1"
                  x1="644"
                  y1="221"
                  x2="429.946"
                  y2="37.0429"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_0:1"
                  x1="18.3648"
                  y1="166.016"
                  x2="105.377"
                  y2="32.3398"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>
      )}

      {/* Content Section */}
      <div className="container mt-20">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Agreement</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-6">
          By accessing or using Léon Services, you agree to abide by these terms of service.
          If you do not agree to these terms, please do not use our platform.
        </p>

        <ul className="mt-8 space-y-4">
          <li className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">User Obligations:</span> You agree to provide accurate and complete
            information when using our services.
          </li>
          <li className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Prohibited Activities:</span> You may not engage in illegal activities,
            harassment, or any behavior that violates these terms.
          </li>
          <li className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Termination:</span> We reserve the right to terminate your access if
            you violate these terms.
          </li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mt-12">Limitations of Liability</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-6">
          Léon Services is not liable for any damages arising from the use of our platform or services.
        </p>

        <div className="mt-10 flex space-x-6">
          <Link
            href="/privacy-policy"
            className="mb-10 rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
          >
            Go to Privacy Policy
          </Link>
          <Link
            href="/code-of-conduct"
            className="mb-10 rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
          >
            Go to Code of Conduct
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
