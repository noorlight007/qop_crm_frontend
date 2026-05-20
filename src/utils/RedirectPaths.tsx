import { Session } from "next-auth";

export const getDashboardHomeUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }

  const role = session?.user?.role;
  const isNetwork = session?.user?.is_network;

  if (!role) return "/auth/login";

  // Global Admin (no organisation/network scope) or network-level super-admin
  if (role === "SUPER_ADMIN") {
    return "/super-admin/dashboard";
  }

  // Organisation Admin
  if (role === "ADMIN" && isNetwork === false) {
    return "/organisation/admin/dashboard";
  }

  if (role === "DIRECTOR") {
    return isNetwork
      ? "/network/director/dashboard"
      : "/organisation/director/dashboard";
  }

  if (role === "COMPLIANCE") {
    // Compliance users share the director dashboard within their scope
    return isNetwork
      ? "/network/director/dashboard"
      : "/organisation/director/dashboard";
  }

  if (role === "ADVISER") {
    return isNetwork
      ? "/network/adviser/dashboard"
      : "/organisation/adviser/dashboard";
  }

  if (role === "APPLICANT") {
    return "/applicant/dashboard";
  }

  return "/auth/login";
};

// Function to generate role-based URL for case details
export const getAllCasesUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }
  const role = session?.user?.role;
  const isNetwork = session?.user?.is_network;

  if (!role) return "/auth/login";

  if (role === "ADMIN" && isNetwork === false) {
    return "/organisation/admin/case-management/all-cases";
  }

  if (role === "DIRECTOR") {
    return isNetwork
      ? "/network/director/case-management/all-cases"
      : "/organisation/director/case-management/all-cases";
  }

  if (role === "COMPLIANCE") {
    return isNetwork
      ? "/network/director/case-management/all-cases"
      : "/organisation/director/case-management/all-cases";
  }

  if (role === "ADVISER") {
    return isNetwork
      ? "/network/adviser/case-management/all-cases"
      : "/organisation/adviser/case-management/all-cases";
  }

  if (role === "APPLICANT") {
    return "/applicant/dashboard";
  }

  return "url not found";
};

// Function to generate role-based URL for case details
export const getCaseUrl = (
  caseAlias: string,
  role: string,
  isNetwork?: boolean,
) => {
  if (role === "ADMIN" && isNetwork === false) {
    return `/organisation/admin/case-management/all-cases/${caseAlias}`;
  }

  if (role === "DIRECTOR") {
    return isNetwork
      ? `/network/director/case-management/all-cases/${caseAlias}`
      : `/organisation/director/case-management/all-cases/${caseAlias}`;
  }

  if (role === "COMPLIANCE") {
    return isNetwork
      ? `/network/director/case-management/all-cases/${caseAlias}`
      : `/organisation/director/case-management/all-cases/${caseAlias}`;
  }

  if (role === "ADVISER") {
    return isNetwork
      ? `/network/adviser/case-management/all-cases/${caseAlias}`
      : `/organisation/adviser/case-management/all-cases/${caseAlias}`;
  }

  if (role === "APPLICANT") {
    return `/client/cases/${caseAlias}`;
  }

  return "#";
};

// Function to generate role-based URL for support-ticket details
export const getSupportTicketUrl = (
  supportTicketAlias: string,
  role: string,
  isNetwork?: boolean,
) => {
  if (role === "SUPER_ADMIN") {
    return `/super-admin/support-ticket/${supportTicketAlias}`;
  }

  if (role === "ADMIN" && isNetwork === false) {
    return `/organisation/admin/support-ticket/${supportTicketAlias}`;
  }

  if (role === "DIRECTOR") {
    return isNetwork
      ? `/network/director/support-ticket/${supportTicketAlias}`
      : `/organisation/director/support-ticket/${supportTicketAlias}`;
  }

  if (role === "COMPLIANCE") {
    return isNetwork
      ? `/network/director/support-ticket/${supportTicketAlias}`
      : `/organisation/director/support-ticket/${supportTicketAlias}`;
  }

  if (role === "ADVISER") {
    return isNetwork
      ? `/network/adviser/support-ticket/${supportTicketAlias}`
      : `/organisation/adviser/support-ticket/${supportTicketAlias}`;
  }

  if (role === "APPLICANT") {
    return `/client/support-ticket/${supportTicketAlias}`;
  }

  return "#";
};

export const getOrganisationUrl = (session: Session | null) => {
  if (!session) {
    return "/auth/login";
  }
  const role = session?.user?.role;
  const isNetwork = session?.user?.is_network;

  if (!role) return "/auth/login";

  if (role === "SUPER_ADMIN") {
    return "/super-admin/organisations";
  }

  if (role === "DIRECTOR" || role === "COMPLIANCE") {
    return isNetwork ? "/network/director/organisations" : "url not found";
  }

  if (role === "ADVISER" && isNetwork) {
    return "/network/adviser/organisations";
  }

  return "url not found";
};

export const getNetworkCaseUrl = (
  networkslug: string,
  caseAlias: string,
  role: string,
) => {
  if (role === "SUPER_ADMIN") {
    return `/super-admin/networks/${networkslug}/${caseAlias}`;
  }
  return "#";
};

export const getOrganisationCaseUrl = (
  organisationSlug: string,
  caseAlias: string,
  role?: string,
) => {
  if (!organisationSlug || !caseAlias) {
    return "#";
  }

  if (role === "SUPER_ADMIN") {
    return `/super-admin/organisations/${organisationSlug}/${caseAlias}`;
  }

  if (role === "DIRECTOR" || role === "COMPLIANCE") {
    return `/network/director/organisations/${organisationSlug}/${caseAlias}`;
  }

  if (role === "ADVISER") {
    return `/network/adviser/organisations/${organisationSlug}/${caseAlias}`;
  }

  return "#";
};

export const getApplicantCaseUrl = (
  session: Session | null,
  caseAlias: string,
) => {
  if (!session) {
    return "/auth/login";
  }
  const role = session?.user?.role;
  if (role === "APPLICANT") {
    return `/applicant/cases/${caseAlias}`;
  }
  return "url not found";
};
