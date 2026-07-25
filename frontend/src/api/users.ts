import { api } from "./axios";

export const usersApi = {
  getUsers: async () => {
    const response = await api.get("/api/admin/users");
    return response.data.users;
  },

  updateUser: async (
    id: number,
    payload: {
      full_name: string;
      role: string;
      status: string;
    }
  ) => {
    const response = await api.put(`/api/admin/users/${id}`, payload)
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/api/admin/users/${id}`)
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: string
  ) => {
    const response = await api.patch(`/api/admin/users/${id}/status`, {
  is_active: status === "active",
});

    return response.data;
  },
};