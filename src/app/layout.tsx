"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current path

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html suppressHydrationWarning lang="en">
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          {!isDashboard && <Header />} {/* ✅ Hide Header for Dashboard */}
          {children}
          {!isDashboard && <Footer />} {/* ✅ Hide Footer for Dashboard */}
          {!isDashboard && <ScrollToTop />}
          
        <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
