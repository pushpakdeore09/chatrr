import apiClient from "../apiClient";

export const searchUser = async (searchTerm: string) => {
  try {
    const response = await apiClient.get(
      `/chat/v1/get-chats?search=${encodeURIComponent(searchTerm)}`,
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
