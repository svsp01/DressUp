import axiosInstance from ".";

const fetchItems = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/api/closet");
    console.log(response?.data, ">>>");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch clothing items:", error);
    return [];
  }
};

const AddCloset = async (Data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/closet", Data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to add clothing item, please try again.";
    throw new Error(errorMessage);
  }
};

const EditCloset = async (id: any, Data: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/api/closet/${id}`, Data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to update clothing item, please try again.";
    throw new Error(errorMessage);
  }
};

const RemoveClosetById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/api/closet/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to remove clothing item, please try again.";
    throw new Error(errorMessage);
  }
};

const closetServices = {
  AddCloset,
  EditCloset,
  RemoveClosetById,
  fetchItems,
};

export default closetServices;
