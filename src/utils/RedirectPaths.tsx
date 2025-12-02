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
    case "NETWORK_ADMIN":
      return "/dashboard/network";
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return "/dashboard/network";
    case "NETWORK_ADVISER":
      return "/dashboard/netadviser";
    case "ORGANIZATION_ADMIN":
      return "/dashboard/organisation";
    case "ORGANIZATION_ADVISER":
      return "/dashboard/orgadviser";
    case "ORGANIZATION_SUPPORT":
      return "/dashboard/orgstaff";
    case "CLIENT":
      return "/dashboard/client";
    default:
      return "/auth/login";
  }
};
