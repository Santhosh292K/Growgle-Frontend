"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { refreshToken } from "@/lib/services/authApi";
import { getUserProfile } from "@/lib/services/profileApi";

export async function checkAuth() {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      try {
        await getUserProfile();
        return true;
      } catch (err) {
        const status = err?.response?.status;
        if (status !== 401 && status !== 403) {
          return true;
        }
      }
    }

    const res = await refreshToken();
    if (res?.status !== 200) {
      return false
    }
    const newToken = res?.data?.token;
    if (newToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", newToken);
      return true;
    }
    console.log("No new token");
    return false
  } catch (e) {
    console.log("Auth check error:", e);
    return false
  }
}

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function useAuth() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        if (token) {
          try {
            await getUserProfile();
            if (!cancelled) setChecking(false);
            return true;
          } catch (err) {
            const status = err?.response?.status;
            if (status !== 401 && status !== 403) {
              if (!cancelled) setChecking(false);
              return true;
            }
          }
        }

        const res = await refreshToken();
        if (res?.status !== 200) {
          return false
        }
        const newToken = res?.data?.token;
        if (newToken && typeof window !== "undefined") {
          localStorage.setItem("accessToken", newToken);
          if (!cancelled) setChecking(false);
          return true;
        }
        console.log("No new token");
        return false
      } catch (e) {
        console.log("Auth check error:", e);
        return false
      }
    }
    useAuth().then((result) => {
      console.log("Auth result:", result);
      if (result === false) {
        router.replace(
          `/auth/login?next=${encodeURIComponent(pathname || "/")}`
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
