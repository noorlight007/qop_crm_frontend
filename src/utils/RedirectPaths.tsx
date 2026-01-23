import { Session } from "next-auth";

export const getDashboardHomeUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }

  const userType = session?.user?.user_type;
  switch (userType) {
    case "ADMIN":
      return "/admin";
    case "NETWORK_DIRECTOR":
      return "/network/director";
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return "/network/director";
    case "NETWORK_ADVISER":
      return "/network/adviser";
    case "ORGANISATION_DIRECTOR":
      return "/organisation/director";
    case "ORGANISATION_ADVISER":
      return "/organisation/adviser";
    case "ORGANISATION_ADMIN":
      return "/organisation/admin";
    case "CLIENT":
      return "/client";
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
      return `/admin`;
    case "NETWORK_DIRECTOR":
      return `/network/director/cases`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/network/director/cases`;
    case "NETWORK_ADVISER":
      return `/network/adviser/cases`;
    case "ORGANISATION_DIRECTOR":
      return `/organisation/director/cases`;
    case "ORGANISATION_ADVISER":
      return `/organisation/adviser/cases`;
    case "ORGANISATION_ADMIN":
      return `/organisation/admin/cases`;
    case "CLIENT":
      return `/client/cases`;
    default:
      return `url not found`;
  }
};

// Function to generate role-based URL for case details
export const getCaseUrl = (caseAlias: string, userType: string) => {
  switch (userType) {
    case "ADMIN":
      return `/admin/cases/${caseAlias}`;
    case "NETWORK_DIRECTOR":
      return `/network/director/cases/${caseAlias}`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/network/director/cases/${caseAlias}`;
    case "NETWORK_ADVISER":
      return `/network/adviser/cases/${caseAlias}`;
    case "ORGANISATION_DIRECTOR":
      return `/organisation/director/cases/${caseAlias}`;
    case "ORGANISATION_ADVISER":
      return `/organisation/adviser/cases/${caseAlias}`;
    case "ORGANISATION_ADMIN":
      return `/organisation/admin/cases/${caseAlias}`;
    case "CLIENT":
      return `/client/cases/${caseAlias}`;
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
      return `/admin/support-ticket/${supportTicketAlias}`;
    case "NETWORK_DIRECTOR":
      return `/network/director/support-ticket/${supportTicketAlias}`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/network/director/support-ticket/${supportTicketAlias}`;
    case "NETWORK_ADVISER":
      return `/network/adviser/support-ticket/${supportTicketAlias}`;
    case "ORGANISATION_DIRECTOR":
      return `/organisation/director/support-ticket/${supportTicketAlias}`;
    case "ORGANISATION_ADVISER":
      return `/organisation/adviser/support-ticket/${supportTicketAlias}`;
    case "ORGANISATION_ADMIN":
      return `/organisation/admin/support-ticket/${supportTicketAlias}`;
    case "CLIENT":
      return `/client/support-ticket/${supportTicketAlias}`;
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
      return `/network/director/organisations`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/network/director/organisations`;
    case "NETWORK_ADVISER":
      return `/network/adviser/organisations`;
    default:
      return `url not found`;
  }
};
