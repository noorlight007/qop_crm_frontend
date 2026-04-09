"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

// Inner component to handle logout detection
const SessionMonitor = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Listen for logout signals from other tabs via localStorage
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "qop_logout") {
        // Force redirect to login when other tab logs out
        setTimeout(() => {
          router.push("/auth/login");
        }, 100);
      }
    };

    // BroadcastChannel listener for logout events
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && (window as any).BroadcastChannel) {
        bc = new BroadcastChannel("qop_channel");
        bc.onmessage = (msg) => {
          if (msg?.data === "logout") {
            setTimeout(() => {
              router.push("/auth/login");
            }, 100);
          }
        };
      }
    } catch (err) {
      // ignore
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      try {
        if (bc) bc.close();
      } catch (err) {
        // ignore
      }
    };
  }, [router]);

  // Monitor session status changes - detect when session becomes null
  useEffect(() => {
    if (status === "unauthenticated" && session === null) {
      // Check if current path is in the auth routes (public pages)
      const pathname = window.location.pathname;
      const isPublicPath =
        pathname.startsWith("/auth/") ||
        pathname.startsWith("/applicant-enquiry") ||
        pathname.startsWith("/client-survey");

      // Only redirect to login if NOT on a public page
      if (!isPublicPath) {
        router.push("/auth/login");
      }
    }
  }, [status, session, router]);

  return <>{children}</>;
};

const SessionWrapper = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return (
    <SessionProvider session={session}>
      <SessionMonitor>{children}</SessionMonitor>
    </SessionProvider>
  );
};

export default SessionWrapper;
