"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any; 
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && document) {

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          const browserLanguage = navigator.language;
          const defaultLanguage = browserLanguage.split("-")[0]; 

          new window.google.translate.TranslateElement(
            {
              pageLanguage: defaultLanguage,
              includedLanguages: "en,fr",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, 
              autoDisplay: false,
            },
            "google_translate_element"
          );
          

          const translateElement = document.getElementById("google_translate_element");
          const iframe = translateElement?.querySelector("iframe");
          if (iframe) {
            iframe.style.border = "none";
            iframe.style.width = "100%";
          }
        }
      };

      if (!document.querySelector("script[src*='translate.google.com']")) {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      return () => {
        const script = document.querySelector("script[src*='translate.google.com']");
        if (script) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="google-translate-wrapper flex justify-center items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <div id="google_translate_element" className="text-center"></div>
    </div>
  );
};

export default GoogleTranslate;
