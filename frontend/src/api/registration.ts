import { api } from "./axios";

export const registrationApi = {
  // --------------------------------------------
  // Get Registration Requests
  // --------------------------------------------
  getRequests: async () => {
  const response = await api.get("/registration-requests");
  return response.data.requests;
},

  // --------------------------------------------
  // Approve Registration
  // --------------------------------------------
  approveRequest: async (requestId: number) => {
    const response = await api.post(
      `/registration-requests/${requestId}/approve`
    );

    return response.data;
  },

  // --------------------------------------------
  // Reject Registration
  // --------------------------------------------
  rejectRequest: async (
    requestId: number,
    reason: string
  ) => {
    const response = await api.post(
      `/registration-requests/${requestId}/reject`,
      {
        reason,
      }
    );

    return response.data;
  },

  register: async (payload: {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  requested_role: string;
}) => {
  const response = await api.post("/register", payload);
  return response.data;
},
};
