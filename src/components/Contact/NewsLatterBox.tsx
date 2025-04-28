"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useSubscription } from "@/Hooks/subscriptions"; // adjust the path
import { toast } from "react-hot-toast";

const NewsLatterBox = () => {
  const { theme } = useTheme();
  const { createSubscription, loading } = useSubscription();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createSubscription(formData);
      toast.success("Thank you for subscribing!");
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error(error);
      // Error is already handled inside useSubscription with toast, so optional here
    }
  };

  return (
    <div className="relative z-10 rounded-sm bg-white p-8 shadow-three dark:bg-gray-dark sm:p-11 lg:p-8 xl:p-11">
      <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
        Subscribe for HR Insights
      </h3>
      <p className="mb-11 border-b border-body-color border-opacity-25 pb-11 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-25">
        Stay informed with the latest trends, best practices, and expert tips in HR management. Subscribe now to receive timely updates straight to your inbox.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="border-stroke mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="border-stroke mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="mb-5 flex w-full cursor-pointer items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
        <p className="text-center text-base leading-relaxed text-body-color dark:text-body-color-dark">
          No spam guaranteed, So please don’t send any spam mail.
        </p>
      </form>

      <div>
        <span className="absolute left-2 top-7">
          <svg
            width="57"
            height="65"
            viewBox="0 0 57 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z"
              fill="url(#paint0_linear_1028_600)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_600"
                x1="-13.8507"
                y1="15.9338"
                x2="31.6982"
                y2="65.0416"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute bottom-24 left-1.5">
          <svg
            width="39"
            height="32"
            viewBox="0 0 39 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M14.7137 31.4215L38.6431 4.24115L6.96581 6.21983L14.7137 31.4215Z"
              fill="url(#paint0_linear_1028_601)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_601"
                x1="8.44425"
                y1="28.4024"
                x2="38.6478"
                y2="3.44025"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-2 top-[140px]">
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M10.6763 35.3091C23.3976 41.6367 38.1681 31.7045 37.107 17.536C36.0455 3.36746 21.698 -5.66705 8.97669 0.660527C-3.74463 6.9881 -4.80595 21.1566 6.25535 35.3091"
              fill="url(#paint0_linear_1028_602)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_602"
                x1="5.60864"
                y1="36.5299"
                x2="24.553"
                y2="-3.9256"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-0 top-0">
          <svg
            width="162"
            height="91"
            viewBox="0 0 162 91"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.3">
              <path
                opacity="0.45"
                d="M1 89.9999C8 77.3332 27.7 50.7999 50.5 45.9999C79 39.9999 95 41.9999 106 30.4999C117 18.9999 126 -3.50014 162 2.99986"
                stroke="url(#paint0_linear_1028_603)"
              />
              <path
                opacity="0.45"
                d="M43 64.9999C50 52.3332 69.7 25.7999 92.5 20.9999C121 14.9999 137 16.9999 148 5.49986C159 -6.00014 168 -28.5001 204 -22.0001"
                stroke="url(#paint1_linear_1028_603)"
              />
              <path
                opacity="0.45"
                d="M4 73.9999C11 61.3332 30.7 34.7999 53.5 29.9999C82 23.9999 98 25.9999 109 14.4999C120 2.99986 129 -19.5001 165 -13.0001"
                stroke="url(#paint2_linear_1028_603)"
              />
              <path
                opacity="0.45"
                d="M33 90.9999C40 78.3332 59.7 51.7999 82.5 46.9999C111 40.9999 127 42.9999 138 31.4999C149 19.9999 158 -2.50014 194 4.00086"
                stroke="url(#paint3_linear_1028_603)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_1028_603"
                x1="4.1568"
                y1="101.33"
                x2="184.344"
                y2="50.5795"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1028_603"
                x1="46.1568"
                y1="76.33"
                x2="226.344"
                y2="25.5795"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1028_603"
                x1="7.1568"
                y1="85.33"
                x2="187.344"
                y2="34.5795"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1028_603"
                x1="36.1568"
                y1="102.33"
                x2="216.344"
                y2="51.5795"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default NewsLatterBox;
