import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    // Extract subdomain from browser URL
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      let subdomainToSet = "";

      // If localhost, set default subdomain
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        subdomainToSet = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "test-plus";
      } else {
        const parts = hostname.split(".");

        // Extract subdomain (first part if there are multiple parts)
        if (
          parts.length > 2 ||
          (parts.length === 2 && parts[1] === "localhost")
        ) {
          const subdomain = parts[0];
          if (subdomain && subdomain !== "www") {
            subdomainToSet = subdomain;
          }
        }
      }

      if (subdomainToSet) {
        headers.set("X-Tenant-Subdomain", subdomainToSet);
      }
    }

    return headers;
  },
});
export const authBaseApi = createApi({
  reducerPath: "authBaseApi",
  baseQuery: baseQuery,
  tagTypes: [
    //Appearance Settings
    "AppearanceSettings",
    "SetPassword",
    "ForgotPassword",
  ],
  endpoints: () => ({}),
});
