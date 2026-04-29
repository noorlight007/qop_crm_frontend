import { NotificationRouteInput } from "@/Types/Common/Notification/NotificationType";
import { getCaseUrl, getSupportTicketUrl } from "@/utils/RedirectPaths";
import type { Session } from "next-auth";

const readNotificationTypeAndAlias = (notification: NotificationRouteInput) => {
  const rawType =
    notification.dataType ??
    (typeof notification.data?.type === "string"
      ? notification.data.type
      : undefined);
  const rawAlias =
    notification.dataAlias ??
    (typeof notification.data?.alias === "string"
      ? notification.data.alias
      : undefined);

  return {
    type: typeof rawType === "string" ? rawType.toUpperCase() : undefined,
    alias: typeof rawAlias === "string" ? rawAlias : undefined,
  };
};

export const getNotificationTargetUrl = (
  notification: NotificationRouteInput,
  session: Session | null,
  fallbackUrl = "/notifications",
) => {
  const role = session?.user?.role;
  const isNetwork = session?.user?.is_network;

  if (!role) {
    return fallbackUrl;
  }

  const { type, alias } = readNotificationTypeAndAlias(notification);

  if (type === "SUPPORT_TICKET" && alias) {
    return getSupportTicketUrl(alias, role, isNetwork);
  }

  if (type === "CASE" && alias) {
    return getCaseUrl(alias, role, isNetwork);
  }

  return fallbackUrl;
};
