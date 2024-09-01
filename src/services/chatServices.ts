import axiosInstance from ".";

const Chat = async (Data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/chat", Data);
    const data = response.data;

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Dress up failed, please try again.";
    throw new Error(errorMessage);
  }
};

export default {
  Chat,
};
