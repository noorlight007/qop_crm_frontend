import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";

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

    return headers;
  },
});
// Mutex and promise holder for token refresh
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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

      const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/jwt/refresh/`;
      const response = await fetch(refreshUrl, {
        method: "POST",
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

  // Handle 401 Unauthorized
  if (result.error && result.error.status === 401) {
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
    //AddUser
    "AddUser",

    //Common components start
    "LeadDetails",
    "ClientDetails",
    "AdviserDetails",
    "IntroducerDetails",
    "Users",
    "AuthUsers",
    "UserProfileDetails",
    "ResetPassword",
    // Common components end

    // Single case info start
    "CaseDetails",
    "SectionCompleteStatus",
    "CasesSummary",
    "JointUserDetails",
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
    "MortgageYourNeeds",
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
    // Case details end
    //Common components end

    //Network Director start
    "OrganisationList",
    "SingleOrganisation",
    "NetworkReports",
    "OrgLeads",
    "OrgClients",
    "OrgCases",
    "OrgAdvisers",
    "NetworkDirectorDashboard",
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
    "OrganisationStaffReports",
    //Organisation Admin and support staff end

    // Client start
    "CLientApplicationDetails",
  ],
  endpoints: () => ({}),
});

export const logOut = async () => {
  // Collect tokens from localStorage or session
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  if (typeof window !== "undefined") {
    try {
      accessToken = localStorage.getItem("token");
      refreshToken = localStorage.getItem("refreshToken");
    } catch (e) {
      console.error("Error reading localStorage during logout", e);
    }
  } else {
    try {
      const session = await getSession();
      accessToken = session?.user?.accessToken ?? null;
      refreshToken = session?.user?.refreshToken ?? null;
    } catch (e) {
      console.error("Error reading session during logout", e);
    }
  }

  // Call logout API if tokens are available
  if (refreshToken) {
    try {
      const formData = new FormData();
      formData.append("refresh", refreshToken);

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
        body: formData,
      }).catch((error) => {
        console.error("Logout API call failed:", error);
      });
    } catch (e) {
      console.error("Error calling logout API", e);
    }
  }

  // Clear local storage
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch (e) {
      console.error("Error clearing localStorage during logout", e);
    }
  }

  try {
    await signOut({ callbackUrl: "/auth/login" });
  } catch (e) {
    console.error("Error during signOut", e);
  }
};
