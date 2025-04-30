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
  House,
  X,
  AppWindow,
  MessagesSquare,
} from "lucide-react";
import LanguageSelector from "@/components/GoogleTranslate";
import { isLoggedIn } from "@/Hooks/useAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = isLoggedIn();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        if (sidebar && !sidebar.contains(e.target as Node) &&
          menuButton && !menuButton.contains(e.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-gray-900 text-black dark:text-white shadow-lg transform transition-transform duration-300 z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4 mt-2">
          <Link href="/dashboard" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
            <BarChart className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
            <Briefcase className="w-5 h-5 mr-3" /> Manage Jobs
          </Link>

          <div className="group">
            <div className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors duration-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                Users
              </div>
              <svg className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.2l3.71-3.97a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden group-hover:block ml-8 mt-2 space-y-1">
              <Link href="/dashboard/users" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
                Manage Users
              </Link>
              <Link href="/dashboard/subscriptions" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
                Manage Subscriptions
              </Link>
            </div>
          </div>

          <Link href="/dashboard/applications" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
            <AppWindow className="w-5 h-5 mr-3" /> Applications
          </Link>
          <Link href="/dashboard/messages" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
            <MessagesSquare className="w-5 h-5 mr-3" /> Messages
          </Link>
          <Link href="/dashboard/settings" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </Link>
        </nav>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 text-black dark:text-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          {/* Left: Logo & Menu Button */}
          <div className="flex items-center gap-2">
            <button
              id="menu-button"
              className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold truncate">Admin Dashboard</h1>
          </div>

          {/* Right: Language Selector, Dark Mode Toggle, and Home Icon */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700 dark:text-white" />
              )}
            </button>

            <Link
              href="/"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label=""
            >
              <House className="h-5 w-5" />
            </Link>
          </div>
        </header>



        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}