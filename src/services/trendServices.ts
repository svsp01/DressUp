import axiosInstance from ".";

// Fetch all trends with pagination
const getAllTrends = async (page: number, limit: number): Promise<any> => {
    try {
      const response = await axiosInstance.get("/api/trend", {
        params: { page, limit },
      });
  
      const data = response.data;
      
      return data;
    } catch (error: any) {
      console.error("Failed to fetch trends:", error);
      return { data: [], hasMore: false };
    }
  };
  

const reportTrendById = async (itemId: string, feedback: any): Promise<any> => {
    try {
      const response = await axiosInstance.patch(`/api/trend/${itemId}`, { feedback });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.reply ||
        "Failed to report trend, please try again.";
      throw new Error(errorMessage);
    }
  };
  

const deleteTrendById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/api/trend/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.reply ||
      "Failed to delete trend, please try again.";
    throw new Error(errorMessage);
  }
};

export default {
  getAllTrends,
  reportTrendById,
  deleteTrendById
};
