import apiClient from "../apiClient";

export const login = async (loginData: object) => {
  try {
    const response = await apiClient.post("/auth/v1/login", loginData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (registerData: object) => {
  try {
    const response = await apiClient.post("/auth/v1/register", registerData);

    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/v1/logout", {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const sendOTP = async (email: string) => {
  try {
    const response = await apiClient.post('auth/v1/send-otp', {email});
    return response;
    
  } catch (error) {
    throw error;
  }
}

export const verifyOTP = async (data: object) => {
  try {
    const response = await apiClient.post("/auth/v1/verify-otp", data);
    console.log(response);
    return response;
  } catch (error) {
    throw error
  }
}

export const updatePassword = async (data: object) => {
  try {
    const response = await apiClient.post("/auth/v1/update-password", data);
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
}
