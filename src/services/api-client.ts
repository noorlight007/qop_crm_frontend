import axios from "axios";
import { getSession } from "next-auth/react";

// Create a reusable Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// console.log("inside intercepto r  filessss", {
//   res: apiClient.defaults,
// });

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    // console.log("Session Data:", session); // Add detailed logging

    const token = session?.user?.accessToken;
    // console.log("Token:", token); // Check if the token is retrieved correctly

    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    } else {
      // console.warn("No token found in session!");
    }

    // Add subdomain header
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      // If localhost, set default subdomain
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        config.headers["X-TENANT-SUBDOMAIN"] =
          process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "test-plus";
      } else {
        const parts = hostname.split(".");

        // Extract subdomain (first part if there are multiple parts)
        let subdomain = "";
        if (
          parts.length > 2 ||
          (parts.length === 2 && parts[1] === "localhost")
        ) {
          subdomain = parts[0];
        }

        if (subdomain && subdomain !== "www") {
          config.headers["X-TENANT-SUBDOMAIN"] = subdomain;
        }
      }
    }

    return config;
  },
  (error) => {
    // console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
