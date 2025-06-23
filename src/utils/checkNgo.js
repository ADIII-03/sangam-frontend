import { axiosInstance } from "./axiosInstance";

export const checkNgo = async () => {
  try {
    const response = await axiosInstance.get(`/auth/my-profile`, {
    });
    return response.data.ngo;
  } catch (error) {
    console.error("Error checking NGO profile:", error);
    throw error;
  }
}