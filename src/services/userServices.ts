import {
  LoginResponse,
  LoginUserData,
  SignupResponse,
  SignupUserData,
} from "@/interface/UsersInterface";
import axiosInstance from ".";

const login = async (userData: LoginUserData): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/api/signIn", userData);
    const data = response.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: data.email,
        userId: data.userId,
      })
    );

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Login failed, please try again.";
    throw new Error(errorMessage);
  }
};

const signup = async (userData: SignupUserData): Promise<SignupResponse> => {
  try {
    const response = await axiosInstance.post("/api/signIn", userData);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Signup failed, please try again.";
    throw new Error(errorMessage);
  }
};

const getUserById = async () => {
  try {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Fetching failed, please try again.";
    throw new Error(errorMessage);
  }
};

const userServices = {
  login,
  getUserById,
  signup,
};

export default userServices
