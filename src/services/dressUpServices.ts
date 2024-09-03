import axiosInstance from ".";

const dressUp = async (Data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/dressup", Data);
    const data = response.data;

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Dress up failed, please try again.";
    throw new Error(errorMessage);
  }
};

const dressUpServices= {
  dressUp
}

export default dressUpServices
