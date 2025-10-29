"use client";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SessionWrapper = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const router = useRouter();

  useEffect(() => {
    // Listen for other tabs signaling logout via localStorage
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "qop_logout") {
        // Redirect to the unauthorized page when other tab logs out
        try {
          router.push("/unauthorized");
        } catch (err) {
          // ignore
        }
      }
    };

    // BroadcastChannel fallback for browsers that support it
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && (window as any).BroadcastChannel) {
        bc = new BroadcastChannel("qop_channel");
        bc.onmessage = (msg) => {
          if (msg?.data === "logout") {
            try {
              router.push("/unauthorized");
            } catch (err) {
              // ignore
            }
          }
        };
      }
    } catch (err) {
      bc = null;
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

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionWrapper;
