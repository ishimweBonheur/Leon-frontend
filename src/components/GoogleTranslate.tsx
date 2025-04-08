"use client";
import { useEffect } from "react";

// Extend the Window interface to include custom properties
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any; // You can replace `any` with a more specific type if needed.
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && document) {
      // Initialize the Google Translate element once the script is loaded
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en", // Default language
              includedLanguages: "en,fr", // Restrict to only English and French
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // Simplified layout
              autoDisplay: false,
            },
            "google_translate_element"
          );
          
          // After initialization, customize the iframe
          const translateElement = document.getElementById("google_translate_element");
          const iframe = translateElement?.querySelector("iframe");
          if (iframe) {
            iframe.style.border = "none";
            iframe.style.width = "100%";
          }
        }
      };

      // Check if the Google Translate script is already loaded
      if (!document.querySelector("script[src*='translate.google.com']")) {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      // Cleanup script when component is unmounted
      return () => {
        const script = document.querySelector("script[src*='translate.google.com']");
        if (script) {
          document.body.removeChild(script);
        }
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="google-translate-wrapper flex justify-center items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <div id="google_translate_element" className="text-center"></div>
    </div>
  );
};

export default GoogleTranslate;
