import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const getBrowserLanguage = (): string => {
  const lang = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "fr";
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("sw")) return "sw";
  return "en";
};

const LanguageSelector = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr"); // default value

  useEffect(() => {
    const getCurrentLanguage = () => {
      const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
      return match ? match[1] : "fr";
    };

    const removeBanner = () => {
      document
        .querySelectorAll(".goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame")
        .forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      document.body.style.top = "0px";
    };

    const observer = new MutationObserver(() => removeBanner());
    observer.observe(document.body, { childList: true, subtree: true });

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr",
          includedLanguages: "en,fr,sw",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
      setIsLoaded(true);
      removeBanner();
    };

    if (!window.google || !window.google.translate) {
      const scriptId = "google-translate-script";
      if (!document.querySelector(`#${scriptId}`)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    } else {
      window.googleTranslateElementInit();
    }

    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, .goog-te-gadget {
        display: none !important;
      }
      body { top: 0px !important; }
    `;
    document.head.appendChild(style);

    const interval = setInterval(removeBanner, 1000);

    // Set current language after mounting
    const currentLang = getCurrentLanguage();
    setSelectedLanguage(currentLang);

    // Auto-detect and apply browser language
    const browserLang = getBrowserLanguage();
    if (browserLang !== currentLang) {
      document.cookie = `googtrans=/fr/${browserLang}; path=/; domain=.${window.location.hostname}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      setSelectedLanguage(browserLang);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    if (!isLoaded) return;

    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }

    setSelectedLanguage(langCode);

    setTimeout(() => {
      window.location.reload();
    }, 500);
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
    </div>
  );
};

export default LanguageSelector;
