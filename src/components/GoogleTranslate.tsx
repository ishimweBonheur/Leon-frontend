"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const getCurrentLanguage = () => {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return match ? match[1] : "en";
};

const LanguageSelector = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());

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

    // ✅ No domain included for Vercel compatibility
    document.cookie = `googtrans=/en/${langCode}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    setSelectedLanguage(langCode);

    const translateSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (translateSelect) {
      translateSelect.value = langCode;
      const event = new Event("change", { bubbles: true });
      translateSelect.dispatchEvent(event);
    }

    // Optional: reload to apply language
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div style={{ position: "relative", zIndex: 1000 }}>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={selectedLanguage}
        className="border-stroke rounded-lg border bg-[#f8f8f8] px-4 py-2 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
        id="languageSwitcher"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="sw">Swahili</option>
      </select>
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default LanguageSelector;
