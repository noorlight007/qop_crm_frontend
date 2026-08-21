import { NotificationData } from '@/Types/Common/Notification/NotificationType';
import { getCaseUrl, getSupportTicketUrl } from '@/utils/RedirectPaths';
import type { Session } from 'next-auth';

export const getNotificationTargetUrl = (
  data: NotificationData | undefined,
  session: Session | null,
) => {
  const role = session?.user?.role;
  const isNetwork = session?.user?.is_network;

  if (!role) {
    return '#';
  }

  const type = data?.type?.toUpperCase();
  const alias = data?.alias;

  if (type === 'SUPPORT_TICKET' && alias) {
    return getSupportTicketUrl(alias, role, isNetwork);
  }

  if (type === 'CASE' && alias) {
    return getCaseUrl(alias, role, isNetwork);
  }

  return '#';
};
