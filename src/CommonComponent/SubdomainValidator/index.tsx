"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const SubdomainValidator = () => {
  const { data: session } = useSession();
  const hasShownError = useRef(false);
  const redirectTimeout = useRef<NodeJS.Timeout>();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    const checkSubdomain = () => {
      const hostname = window.location.hostname;
      let currentSubdomain = "";

      // Remove port number if present
      const hostnameWithoutPort = hostname.split(":")[0];

      if (
        hostnameWithoutPort === "localhost" ||
        hostnameWithoutPort === "127.0.0.1"
      ) {
        currentSubdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "";
      } else {
        const parts = hostnameWithoutPort.split(".");
        if (parts.length >= 3) {
          // For domains like test-org.qopcrm.com
          const subdomain = parts[0];
          if (subdomain && subdomain !== "www") {
            currentSubdomain = subdomain;
          }
        } else if (parts.length === 2) {
          // For cases like qopcrm.com without subdomain, use a default
          currentSubdomain = "www";
        }
      }

      // Get session subdomain
      const sessionSubdomain = (session as any)?.user?.subdomain;

      //   console.log("Full hostname:", hostname);
      //   console.log("Current Subdomain (from URL):", currentSubdomain);
      //   console.log("Session Subdomain:", sessionSubdomain);

      // Validate subdomain matches the one stored in session
      if (
        currentSubdomain &&
        sessionSubdomain &&
        sessionSubdomain !== currentSubdomain
      ) {
        // Prevent showing error multiple times
        if (hasShownError.current) return;

        hasShownError.current = true;
        setIsRedirecting(true);

        // Redirect to correct subdomain after a short delay
        redirectTimeout.current = setTimeout(() => {
          const protocol = window.location.protocol;
          const port = window.location.port ? `:${window.location.port}` : "";
          const newUrl = `${protocol}//${sessionSubdomain}.${hostnameWithoutPort.replace(
            currentSubdomain + ".",
            ""
          )}${port}${window.location.pathname}${window.location.search}`;
          window.location.href = newUrl;
        }, 500);
      }
    };

    checkSubdomain();

    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, [session]);

  if (!isRedirecting) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        color: "#d11200",
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      Checking Domain...
    </div>
  );
};

export default SubdomainValidator;
