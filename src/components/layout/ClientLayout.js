
// components/layout/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/auth");

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideLayout && <Header />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}
