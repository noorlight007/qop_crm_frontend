export interface LoginHistoryItem {
  id?: number;
  user: {
    id: number;
    alias: string;
    name: string;
    email: string;
    phone: string;
    profile_image: string;
    user_type: string;
  };
  ip_address: string;
  device_type: string;
  browser_name: string;
  os: string;
  status: "SUCCESS" | "FAILED" | string;
  logged_in_at: string;
}
