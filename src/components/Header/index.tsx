"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {

    const storedUser = localStorage.getItem('Leon_user') || localStorage.getItem('Farm_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('Leon_user');
    localStorage.removeItem('Farm_user');
    setUser(null);
    setShowDropdown(false);
    router.push('/signin');
  };

  useEffect(() => {
    if (typeof window !== "undefined" && document) {

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,sw', 
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );
      };

      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      const browserLanguage = navigator.language.split("-")[0]; 
      setSelectedLanguage(browserLanguage);
      changeLanguage(browserLanguage); 
    }
  }, []);

  const changeLanguage = (value: string): void => {
    setSelectedLanguage(value);
    if (typeof window !== "undefined" && window.google && window.google.translate) {
      const translateElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (translateElement) {
        translateElement.value = value;
        translateElement.dispatchEvent(new Event("change"));
      }
    }
  };

  function navbarToggleHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    setNavbarOpen((prev) => !prev);
  }

  return (
    <header
      className={`header left-0 top-0 z-40 flex w-full items-center ${navbarOpen
        ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
        : "absolute bg-transparent"
        }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between h-20">
          <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link href="/" className={`header-logo w-full`}>
              <Image
                src="/images/logo/logo-img.png"
                alt="logo"
                width={150}
                height={50}
                className="dark:hidden"
              />
              <Image
                src="/images/logo/logo-img.png"
                alt="logo"
                width={150}
                height={50}
                className="hidden dark:block"
              />
            </Link>
          </div>

          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                {/* Hamburger icon */}
              </button>
              <nav
                id="navbarCollapse"
                className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen ? "visibility top-full opacity-100" : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="block lg:flex lg:space-x-12">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="group relative">
                      {menuItem.path ? (
                        <Link
                          href={menuItem.path}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            pathname === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <p className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6">
                          {menuItem.title}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
                <select
                onChange={(e) => {
                  const selectedLang = e.target.value;
                  changeLanguage(selectedLang);
                }}
                value={selectedLanguage}
                className="border-stroke rounded-lg border bg-[#f8f8f8] px-4 py-2 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="sw">Swahili</option>
                </select>

              {/* User Profile or Sign In */}
              {user ? (
                <div className="relative">
                  <div className="flex items-center cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                    <Image
                      src={user.profilePicture || "/images/profile.png"}
                      alt=" Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="ml-2 text-base font-medium text-dark dark:text-white">
                      {user.name}
                    </span>
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-50 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="px-4 py-2 text-base font-medium text-dark hover:opacity-70 dark:text-white"
                >
                  Sign In
                </Link>
              )}

              <ThemeToggler />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
