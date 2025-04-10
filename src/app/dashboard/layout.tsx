"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  BarChart,
  Users,
  Briefcase,
  Settings,
  X,
} from "lucide-react";
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
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg transform transition-transform duration-300 z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center justify-between p-5 md:hidden">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden md:block p-5">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav className="space-y-4 p-5">
          <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
            <BarChart className="w-5 h-5 mr-2" /> Dashboard
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
            <Briefcase className="w-5 h-5 mr-2" /> Manage Jobs
          </Link>
          <Link href="/dashboard/users" className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
            <Users className="w-5 h-5 mr-2" /> Users
          </Link>
          <Link href="/dashboard/applications" className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
            <Users className="w-5 h-5 mr-2" /> Applications
          </Link>
          <Link href="/dashboard/settings" className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
            <Settings className="w-5 h-5 mr-2" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : ""}`}>
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md flex items-center justify-between px-4 fixed top-0 left-0 w-full z-40 md:left-64 md:w-[calc(100%-16rem)]">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg md:text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full">
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-black dark:text-white" />
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-auto mt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
