export interface NotificationData {
  type: string;
  alias: string;
  is_deleted: boolean;
}

export interface Notification {
  id: number;
  notification_type: string;
  message: string;
  data: NotificationData;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}