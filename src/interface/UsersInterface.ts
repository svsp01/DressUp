export interface LoginUserData {
    email: string;
    password: string;
  }
  
  export interface SignupUserData {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    monthlyIncome?: number;
    profileImageUrl?: string;
    bio?: string;
    skills?: string;
    interests?: string;
  }
  
  export interface LoginResponse {
    token: string;
    email: string;
    userId: string;
  }
  
  export interface SignupResponse {
    message: string;
  }
  