"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languageOptions = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "sw", name: "Kiswahili" },
];

const getCurrentLanguage = () => {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return match ? match[1] : "en";
};

const detectBrowserLanguage = (): string => {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || "en";
  const shortLang = lang.split("-")[0]; // 'en-US' → 'en'
  return languageOptions.some((opt) => opt.code === shortLang) ? shortLang : "en";
};

const LanguageSelector = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  const initializeGoogleTranslate = () => {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,sw",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
      setIsLoaded(true);
      removeTranslateBanner();
    }
  };

  const removeTranslateBanner = () => {
    const elements = document.querySelectorAll(
      ".goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame"
    );
    elements.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
    document.body.style.top = "0px";
  };

  const loadGoogleTranslateScript = () => {
    const scriptId = "google-translate-script";
    if (!document.querySelector(`#${scriptId}`)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const browserLang = detectBrowserLanguage();
    const currentLang = getCurrentLanguage();

    if (browserLang !== currentLang) {
      document.cookie = `googtrans=/en/${browserLang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      setSelectedLanguage(browserLang);
    } else {
      setSelectedLanguage(currentLang);
    }

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (!window.google?.translate?.TranslateElement) {
      loadGoogleTranslateScript();
    } else {
      initializeGoogleTranslate();
    }

    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, .goog-te-gadget {
        display: none !important;
      }
      body { top: 0px !important; }
      .skiptranslate iframe { display: none !important; }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(removeTranslateBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    if (!isLoaded) return;

    document.cookie = `googtrans=/en/${langCode}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    setSelectedLanguage(langCode);
    setIsOpen(false);

    const translateSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (translateSelect) {
      translateSelect.value = langCode;
      const event = new Event("change", { bubbles: true });
      translateSelect.dispatchEvent(event);
    }

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const currentLanguage = languageOptions.find((lang) => lang.code === selectedLanguage);

  if (!isMounted) return null;

  return (
    <div className="relative z-50">
      {/* Mobile View */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                  selectedLanguage === lang.code
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="relative inline-block">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentLanguage?.name}
            </span>
            <svg
              className={`w-4 h-4 ml-1 text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-30 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                    selectedLanguage === lang.code
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default LanguageSelector;
