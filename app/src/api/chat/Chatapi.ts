import apiClient from "../apiClient";

export const getOrCreateNewChat = async (userId: string) => {
  try {
    const response = await apiClient.post(
      "/chat/v1/get-or-create-chat",
      { userId },
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

export const getUserChats = async () => {
  try {
    const response = await apiClient.get("/chat/v1/get-users-chat", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getChat = async (chatId: string) => {
  try {
    const response = await apiClient.get(
      `/chat/v1/get-chat?chatId=${encodeURIComponent(chatId)}`,
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

export const createGroupChat = async (groupInfo: object) => {
  try {
    const response = await apiClient.post(
      "/chat/v1/create-group-chat",
      groupInfo,
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
