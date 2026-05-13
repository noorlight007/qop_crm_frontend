import { logOut } from "@/services/auth/logout";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  // credentials: "include",
  prepareHeaders: async (headers) => {
    const session = await getSession();
    // Prefer refreshed token from localStorage; fall back to session
    const token =
      (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
      session?.user?.accessToken ||
      null;

    if (token) {
      headers.set("authorization", `JWT ${token}`);
    }

    // Extract subdomain from browser URL
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      let subdomainToSet = "";

      // If localhost, set default subdomain
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        subdomainToSet = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "";
      } else {
        const parts = hostname.split(".");

        // Extract subdomain (first part if there are multiple parts)
        // e.g., "subdomain.example.com" -> "subdomain"
        // e.g., "subdomain.localhost" -> "subdomain"
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
        headers.set("X-TENANT-SUBDOMAIN", subdomainToSet);
        // console.log("BaseApi - Setting subdomain header:", subdomainToSet);
      } else {
        console.warn("BaseApi - No subdomain detected for hostname:", hostname);
      }
    }

    return headers;
  },
});
// Mutex and promise holder for token refresh
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const shouldBypassReauthOn401 = (url: string | undefined) => {
  if (!url) return false;
  // Public/auth flows can legitimately return 401 (e.g., invalid/expired token)
  // and should NOT force a global sign-out + redirect.
  const bypassPaths = [
    "/auth/reset-password/",
    "/auth/forgot-password/",
    "/auth/set-password/",
    "/auth/send-email/",
  ];

  return bypassPaths.some((path) => url.includes(path));
};

// Centralized token refresh function with mutex
const refreshAccessToken = async (): Promise<string | null> => {
  // If already refreshing, wait for the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      let refreshToken: string | null = null;

      // Try localStorage first
      if (typeof window !== "undefined") {
        refreshToken = localStorage.getItem("refreshToken");
      }

      // Fallback to session if not in localStorage
      if (!refreshToken) {
        const session = await getSession();
        refreshToken = session?.user?.refreshToken ?? null;
      }

      if (!refreshToken) {
        console.error("No refresh token available");
        await logOut();
        return null;
      }

      const formData = new FormData();
      formData.append("refresh", refreshToken);

      // Extract subdomain for refresh request
      let subdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || ""; // Default for localhost
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;

        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
          const parts = hostname.split(".");
          if (
            parts.length > 2 ||
            (parts.length === 2 && parts[1] === "localhost")
          ) {
            const extractedSubdomain = parts[0];
            if (extractedSubdomain && extractedSubdomain !== "www") {
              subdomain = extractedSubdomain;
            }
          }
        }
      }

      const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/jwt/refresh/`;
      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "X-TENANT-SUBDOMAIN": subdomain,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const newToken = data.access;
      const newRefreshToken = data.refresh;

      // Update localStorage (single source of truth)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
      }

      return newToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      await logOut();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args?.url;

  // Handle 401 Unauthorized
  if (
    result.error &&
    result.error.status === 401 &&
    !shouldBypassReauthOn401(requestUrl)
  ) {
    // Attempt to refresh the token
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry the original request with the new token
      // The new token will be automatically picked up by prepareHeaders
      result = await baseQuery(args, api, extraOptions);
    }
    // If refresh failed, user is already logged out by refreshAccessToken
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    //Appearance Settings
    "AppearanceSettings",

    //company info
    "CompanyInfo",

    //AddUser
    "AddUser",
    "AuthUserList",

    //filters
    "LeadOrClientFilterList",

    //Common components start
    "LeadDetails",
    "ClientDetails",
    "AdviserDetails",
    "IntroducerDetails",
    "Users",
    "AuthUsers",
    "LeadsOrApplicants",
    "UserProfileDetails",
    "ResetPassword",
    "SupportTicket",
    "LeadsOrApplicants",
    "Notifications",
    "CommonFilters",
    // Common components end

    // Single case info start
    "CaseDetails",
    "SectionCompleteStatus",
    "CasesSummary",
    "JointApplicantDetails",
    "CaseDocuments",
    "CaseCopy",
    // Single case info end

    // Common Dashboard start
    "AdviserDashboardData",
    "LoginHistory",
    // Common Dashboard end

    // Case details start
    "LoanDetails",
    "ApplicantsDetails",
    "Dependants",
    "CompanyDetails",
    "PreviousAddress",
    "EmploymentDetails",
    "CreditCommitmentsDetails",
    "CreditCommitmentsSummary",
    "AdverseDetails",
    "Portfolio",
    "SecurityProperty",
    "OtherOccupants",
    "SolicitorDetails",
    "AccountantDetails",
    "ExistingProtectionDetails",
    "NeedsAndPreferences",
    "Notes",
    "Tasks",
    "BudgetPlanner",
    "ProductDetails",
    "DIPHistoryDetails",
    "Suitability",
    "InsuranceHealthDetails",
    "Fees",
    "Compliance",
    "ClientSurvey",
    "Commission",
    "InsuranceOverview",
    "InsurancePolicies",
    "VulnerableClient",
    // Case details end
    //Common components end

    //Network Director start
    "OrganisationList",
    "SingleOrganisation",
    "NetworkReports",
    "OrgMembers",
    "OrgApplicantList",
    "OrgCases",
    "NetworkDirectorDashboard",
    "OrgJointApplicant",
    //Network Director end

    //Network Adviser start
    "NetworkAdviserReports",
    //Network Adviser end

    //Organisation Director start
    "OrganisationDirectorDashboard",
    "OrganisationReports",
    //Organisation Director end

    //Organisation Adviser start
    "OrganisationAdviserReports",
    //Organisation Adviser end

    //Organisation Admin and support staff start
    "OrganisationAdminReports",
    //Organisation Admin and support staff end

    // Client start
    "ApplicantCase",

    // Admin Start
    "NetworkList",
  ],
  endpoints: () => ({}),
});

export { logOut };
