import { Session } from "next-auth";

export const getDashboardHomeUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }

  const userType = session?.user?.user_type;
  switch (userType) {
    case "ADMIN":
      return "/dashboard/admin";
    case "NETWORK_DIRECTOR":
      return "/dashboard/network/director";
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return "/dashboard/network/director";
    case "NETWORK_ADVISER":
      return "/dashboard/network/adviser";
    case "ORGANISATION_DIRECTOR":
      return "/dashboard/organisation/director";
    case "ORGANISATION_ADVISER":
      return "/dashboard/organisation/adviser";
    case "ORGANISATION_ADMIN":
      return "/dashboard/organisation/admin";
    case "CLIENT":
      return "/dashboard/client";
    default:
      return "/auth/login";
  }
};

// Function to generate role-based URL for case details
export const getAllCasesUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }
  const userType = session?.user?.user_type;

  switch (userType) {
    case "ADMIN":
      return `/dashboard/admin`;
    case "NETWORK_DIRECTOR":
      return `/dashboard/network/director/cases`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/dashboard/network/director/cases`;
    case "NETWORK_ADVISER":
      return `/dashboard/network/adviser/cases`;
    case "ORGANISATION_DIRECTOR":
      return `/dashboard/organisation/director/cases`;
    case "ORGANISATION_ADVISER":
      return `/dashboard/organisation/adviser/cases`;
    case "ORGANISATION_ADMIN":
      return `/dashboard/organisation/admin/cases`;
    case "CLIENT":
      return `/dashboard/client/cases`;
    default:
      return `url not found`;
  }
};

// Function to generate role-based URL for case details
export const getCaseUrl = (caseAlias: string, userType: string) => {
  switch (userType) {
    case "ADMIN":
      return `/dashboard/admin/cases/${caseAlias}`;
    case "NETWORK_DIRECTOR":
      return `/dashboard/network/director/cases/${caseAlias}`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/dashboard/network/director/cases/${caseAlias}`;
    case "NETWORK_ADVISER":
      return `/dashboard/network/adviser/cases/${caseAlias}`;
    case "ORGANISATION_DIRECTOR":
      return `/dashboard/organisation/director/cases/${caseAlias}`;
    case "ORGANISATION_ADVISER":
      return `/dashboard/organisation/adviser/cases/${caseAlias}`;
    case "ORGANISATION_ADMIN":
      return `/dashboard/organisation/admin/cases/${caseAlias}`;
    case "CLIENT":
      return `/dashboard/client/cases/${caseAlias}`;
    default:
      return "#";
  }
};
// Function to generate role-based URL for support-ticket details
export const getSupportTicketUrl = (
  supportTicketAlias: string,
  userType: string,
) => {
  switch (userType) {
    case "ADMIN":
      return `/dashboard/admin/support-ticket/${supportTicketAlias}`;
    case "NETWORK_DIRECTOR":
      return `/dashboard/network/director/support-ticket/${supportTicketAlias}`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/dashboard/network/director/support-ticket/${supportTicketAlias}`;
    case "NETWORK_ADVISER":
      return `/dashboard/network/adviser/support-ticket/${supportTicketAlias}`;
    case "ORGANISATION_DIRECTOR":
      return `/dashboard/organisation/director/support-ticket/${supportTicketAlias}`;
    case "ORGANISATION_ADVISER":
      return `/dashboard/organisation/adviser/support-ticket/${supportTicketAlias}`;
    case "ORGANISATION_ADMIN":
      return `/dashboard/organisation/admin/support-ticket/${supportTicketAlias}`;
    case "CLIENT":
      return `/dashboard/client/support-ticket/${supportTicketAlias}`;
    default:
      return "#";
  }
};

export const getOrganisationUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }
  const userType = session?.user?.user_type;

  switch (userType) {
    case "NETWORK_DIRECTOR":
      return `/dashboard/network/director/organisations`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/dashboard/network/director/organisations`;
    case "NETWORK_ADVISER":
      return `/dashboard/network/adviser/organisations`;
    default:
      return `url not found`;
  }
};
