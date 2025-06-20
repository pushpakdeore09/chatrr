import apiClient from "../apiClient";

export const sendMessage = async (msgData: object) => {
  try {
    const response = await apiClient.post("/message/v1/send-message", msgData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllMessages = async (chatId: string) => {
  try {
    const response = await apiClient.get(`/message/v1/${chatId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
