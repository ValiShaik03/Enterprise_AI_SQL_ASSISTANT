export interface Notification {
  notification_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}