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
    "AdviserDashboardData",
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
