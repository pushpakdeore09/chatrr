import apiClient from "../apiClient";

export const getUserProfile = async (userId: string) => {
  try {
    const response = await apiClient.get(
      `/profile/v1/get-profile?userId=${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
