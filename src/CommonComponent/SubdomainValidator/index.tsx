"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const SubdomainValidator = () => {
  const { data: session } = useSession();

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
        currentSubdomain =
          process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "test-plus";
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
        console.log("⚠️ Subdomain mismatch detected! Redirecting back...");
        toast.error(
          "Subdomain mismatch detected. Redirecting to the previous page."
        );
        // Use browser's back navigation to return to previous page
        window.history.back();
      } else {
        // console.log("✓ Subdomain validation passed");
        // toast.success("Subdomain validation passed.");
      }
    };

    checkSubdomain();
  }, [session]);

  return null;
};

export default SubdomainValidator;
