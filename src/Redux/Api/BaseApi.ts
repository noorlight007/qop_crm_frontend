import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  // credentials: "include",
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (token) {
      headers.set("authorization", `JWT ${token}`);
    }

    return headers;
  },
});
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: [
    //AddUser
    "AddUser",

    //Common components start
    "LeadDetails",
    "ClientDetails",
    "AdviserDetails",
    "IntroducerDetails",
    "Users",
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
    "CommonDashboard",
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

    //Network start
    "OrganisationList",
    "SingleOrganisation",
    "NetworkReports",
    "OrgLeads",
    "OrgClients",
    "OrgCases",
    "OrgAdvisers",
    //Network end

    //Network Adviser start
    "NetworkAdviserReports",
    //Network Adviser end

    //Organization start
    "OrganisationReports",
    //Organization end

    //Organization Adviser start
    "OrganisationAdviserReports",
    //Organization Adviser end

    //Organization Admin and support staff start
    "OrganisationStaffReports",
    //Organization Admin and support staff end

    // Client start
    "CLientApplicationDetails",
  ],
  endpoints: () => ({}),
});
