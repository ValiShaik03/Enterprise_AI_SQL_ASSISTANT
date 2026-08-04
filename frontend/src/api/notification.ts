import { api } from "./axios";

export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data.notifications;
  },

  markRead: async (notificationId: number) => {
    const response = await api.put(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  },

  markAllRead: async () => {
    const response = await api.put(
      "/notifications/read-all"
    );

    return response.data;
  },
};