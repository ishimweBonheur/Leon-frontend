"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { Menu, BarChart, Users, Briefcase, Settings } from "lucide-react";
import LanguageSelector from "@/components/GoogleTranslate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userRole = "admin";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (userRole !== "admin") {
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`w-64 h-full bg-white dark:bg-gray-900 shadow-xl text-black dark:text-white p-5 space-y-4 fixed z-50 ${isSidebarOpen ? "block" : "hidden"
          } md:block`}
      >
        <h2 className="text-xl font-bold text-black dark:text-white">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <BarChart className="w-5 h-5 mr-2" /> Dashboard
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Briefcase className="w-5 h-5 mr-2" /> Manage Jobs
          </Link>
          <Link href="/dashboard/users" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Users className="w-5 h-5 mr-2" /> Users
          </Link>
          <Link href="/dashboard/applications" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Users className="w-5 h-5 mr-2" /> Applications
          </Link>
          <Link href="/dashboard/settings" className="flex items-center p-2 hover:bg-gray-200 rounded">
            <Settings className="w-5 h-5 mr-2" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}<div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0 md:ml-64"
          }`}
      >

        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md flex items-center justify-between px-4 fixed w-full z-40">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <LanguageSelector />
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full mr-64">
            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-black" />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto mt-16 p-5 ">
          {children}
        </main>
      </div>
    </div>
  );
}
