"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { Menu, BarChart, Users, Briefcase, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userRole = "admin";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (userRole !=="admin") {
      router.push("/");
    }
  }, [userRole, router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="bg-cover bg-center bg-no-repeat flex flex-col md:flex-row ">
      {/* Sidebar */}
      <aside className={`w-64 h-screen   shadow-xl text-black dark:text-white p-5 space-y-4 fixed md:relative md:block ${isSidebarOpen ? "block" : "hidden"} md:w-64 h-full z-50 rounded-r  `}>
        <h2 className="text-xl font-bold text-black dark:text-white">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <BarChart className="w-5 h-5 mr-2" /> Dashboard
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Briefcase className="w-5 h-5 mr-2" /> Manage Jobs
          </Link>
          <Link href="/dashboard/users" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Briefcase className="w-5 h-5 mr-2" /> Users
          </Link>
          <Link href="/dashboard/applications" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Users className="w-5 h-5 mr-2" /> Applications
          </Link>
          <Link href="/dashboard/settings" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Settings className="w-5 h-5 mr-2" /> Settings
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className=" shadow-xl text-white p-4 shadow-md flex justify-between items-center bg-gray-900 dark:bg-gray-900">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full ">
            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-gray-200" />}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-5 text-center text-gray-900 dark:text-gray-100">
          {children}
          <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
            <svg
              width="450"
              height="556"
              viewBox="0 0 450 556"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="277"
                cy="63"
                r="225"
                fill="url(#paint0_linear_25:217)"
              />
              <circle
                cx="17.9997"
                cy="182"
                r="18"
                fill="url(#paint1_radial_25:217)"
              />
              <circle
                cx="76.9997"
                cy="288"
                r="34"
                fill="url(#paint2_radial_25:217)"
              />
              <circle
                cx="325.486"
                cy="302.87"
                r="180"
                transform="rotate(-37.6852 325.486 302.87)"
                fill="url(#paint3_linear_25:217)"
              />
              <circle
                opacity="0.8"
                cx="184.521"
                cy="315.521"
                r="132.862"
                transform="rotate(114.874 184.521 315.521)"
                stroke="url(#paint4_linear_25:217)"
              />
              <circle
                opacity="0.8"
                cx="356"
                cy="290"
                r="179.5"
                transform="rotate(-30 356 290)"
                stroke="url(#paint5_linear_25:217)"
              />
              <circle
                opacity="0.8"
                cx="191.659"
                cy="302.659"
                r="133.362"
                transform="rotate(133.319 191.659 302.659)"
                fill="url(#paint6_linear_25:217)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_25:217"
                  x1="-54.5003"
                  y1="-178"
                  x2="222"
                  y2="288"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <radialGradient
                  id="paint1_radial_25:217"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
                >
                  <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient
                  id="paint2_radial_25:217"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
                >
                  <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
                </radialGradient>
                <linearGradient
                  id="paint3_linear_25:217"
                  x1="226.775"
                  y1="-66.1548"
                  x2="292.157"
                  y2="351.421"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_25:217"
                  x1="184.521"
                  y1="182.159"
                  x2="184.521"
                  y2="448.882"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_25:217"
                  x1="356"
                  y1="110"
                  x2="356"
                  y2="470"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint6_linear_25:217"
                  x1="118.524"
                  y1="29.2497"
                  x2="166.965"
                  y2="338.63"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
            <svg
              width="364"
              height="201"
              viewBox="0 0 364 201"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
                stroke="url(#paint0_linear_25:218)"
              />
              <path
                d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
                stroke="url(#paint1_linear_25:218)"
              />
              <path
                d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
                stroke="url(#paint2_linear_25:218)"
              />
              <path
                d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
                stroke="url(#paint3_linear_25:218)"
              />
              <circle
                opacity="0.8"
                cx="214.505"
                cy="60.5054"
                r="49.7205"
                transform="rotate(-13.421 214.505 60.5054)"
                stroke="url(#paint4_linear_25:218)"
              />
              <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
              <defs>
                <linearGradient
                  id="paint0_linear_25:218"
                  x1="184.389"
                  y1="69.2405"
                  x2="184.389"
                  y2="212.24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_25:218"
                  x1="156.389"
                  y1="69.2405"
                  x2="156.389"
                  y2="212.24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_25:218"
                  x1="125.389"
                  y1="69.2405"
                  x2="125.389"
                  y2="212.24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_25:218"
                  x1="93.8507"
                  y1="67.2674"
                  x2="89.9278"
                  y2="210.214"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_25:218"
                  x1="214.505"
                  y1="10.2849"
                  x2="212.684"
                  y2="99.5816"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <radialGradient
                  id="paint5_radial_25:218"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(220 63) rotate(90) scale(43)"
                >
                  <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                  <stop offset="1" stopColor="white" stopOpacity="0.08" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </main>
        <footer>
          <div className="py-8">
            <p className="text-center text-base text-body-color dark:text-white">
              All rights reserved © Léon Services 2025
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
