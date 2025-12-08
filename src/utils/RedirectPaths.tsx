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
