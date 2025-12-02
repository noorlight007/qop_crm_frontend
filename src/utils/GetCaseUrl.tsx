// Function to generate role-based URL for case details
export const getCaseUrl = (caseAlias: string, userType: string) => {
  switch (userType) {
    case "ADMIN":
      return `/dashboard/admin/cases/${caseAlias}`;
    case "NETWORK_ADMIN":
      return `/dashboard/network/cases/${caseAlias}`;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return `/dashboard/network/cases/${caseAlias}`;
    case "NETWORK_ADVISER":
      return `/dashboard/netadviser/cases/${caseAlias}`;
    case "ORGANIZATION_ADMIN":
      return `/dashboard/organisation/cases/${caseAlias}`;
    case "ORGANIZATION_ADVISER":
      return `/dashboard/orgadviser/cases/${caseAlias}`;
    case "ORGANIZATION_SUPPORT":
      return `/dashboard/orgstaff/caseupdates/${caseAlias}`;
    case "CLIENT":
      return `/dashboard/client/cases/${caseAlias}`;
    default:
      return "#";
  }
};
