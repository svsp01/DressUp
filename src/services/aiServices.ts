import axiosInstance from ".";

const GetAiGenerations = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/api/aiGenerations");
    const data = response.data;

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Dress up failed, please try again.";
    throw new Error(errorMessage);
  }
};

export default {
  GetAiGenerations,
};
