"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers, loginWithGoogle } from "@/Hooks/useAuth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "applicant",
  });
  const router = useRouter();
  const { addUser, loading } = useUsers();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(formData);
      router.push("/signin");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    try {
      const user = await loginWithGoogle(googleToken);
      if (user) {
        router.push("/"); // Redirect after successful registration
      }
    } catch (error) {
      console.error("Google registration failed:", error);
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google registration error");
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Create your account
              </h3>
              
              {/* Properly Styled Google Login */}
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                <div className="mb-6 flex items-center justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    theme="filled_blue"
                    text="continue_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                  </div>
              </GoogleOAuthProvider>

              <div className="mb-8 flex items-center justify-center">
                <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                <p className="w-full px-5 text-center text-base font-medium text-body-color">
                  Or, register with your email
                </p>
                <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-transparent dark:bg-[#2C303B]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-transparent dark:bg-[#2C303B]"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="username" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-transparent dark:bg-[#2C303B]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-transparent dark:bg-[#2C303B]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (123) 456-7890"
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-transparent dark:bg-[#2C303B]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-transparent dark:bg-[#2C303B]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="role" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Account Type
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-body-color">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
    </section>
  );
};

export default SignupPage;