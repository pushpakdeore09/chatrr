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
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};
