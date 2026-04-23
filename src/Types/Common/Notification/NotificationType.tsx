export type UINotification = {
  id: string;
  date: string;
  time: string;
  dotColor: "primary" | "warning";
  fontColor: "primary" | "warning";
  notification_type?: string;
  message: string;
  is_read: boolean;
  dataType?: string;
  dataAlias?: string;
  created_at?: string;
};

export type NotificationRouteInput = {
  data?: Record<string, unknown>;
  dataType?: string;
  dataAlias?: string;
};
