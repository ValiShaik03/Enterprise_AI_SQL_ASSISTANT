import { api } from "./axios";

export const usersApi = {
  getUsers: async () => {
    const response = await api.get("/users");
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
    const response = await api.put(`/users/${id}`, payload);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: string
  ) => {
    const response = await api.patch(
      `/users/${id}/status`,
      { status }
    );

    return response.data;
  },
};