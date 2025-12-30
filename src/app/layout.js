"use client";

import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./providers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyToken, refreshToken } from "@/lib/services/authApi";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const hideLayout =
    pathname.endsWith("/auth/login") ||
    pathname.endsWith("/auth/signup") ||
    pathname.endsWith("/auth/forgot-password");

  useEffect(() => {
    let cancelled = false;

    if (typeof window !== "undefined") {
      const n = localStorage.getItem("userName") || "";
      const e = localStorage.getItem("userEmail") || "";
      if (!cancelled) {
        if (n) setUserName(n);
        if (e) setUserEmail(e);
      }
    }

    async function resolveUser() {
      try {
        const res = await verifyToken({});
        const data = res?.data?.data;
        if (!cancelled && data) {
          setUserName(data.name || "");
          setUserEmail(data.email || "");
          if (typeof window !== "undefined") {
            if (data.name) localStorage.setItem("userName", data.name);
            if (data.email) localStorage.setItem("userEmail", data.email);
          }
          return;
        }
      } catch (err) {
        try {
          const r = await refreshToken();
          const newToken = r?.data?.token;
          if (newToken && typeof window !== "undefined") {
            localStorage.setItem("accessToken", newToken);
            const res2 = await verifyToken({});
            const data2 = res2?.data?.data;
            if (!cancelled && data2) {
              setUserName(data2.name || "");
              setUserEmail(data2.email || "");
              if (data2.name) localStorage.setItem("userName", data2.name);
              if (data2.email) localStorage.setItem("userEmail", data2.email);
            }
          }
        } catch (_) {
        }
      }
    }

    resolveUser();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            {!hideLayout && <Header name={userName} email={userEmail} />}
            <main className="flex-1">{children}</main>
            {!hideLayout && <Footer />}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
