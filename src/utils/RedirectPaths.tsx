import { useSession } from "next-auth/react";

export const getRedirectPaths = () => {
  const { data: session } = useSession();
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
