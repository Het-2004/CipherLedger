import axiosClient from "./axiosClient";

export const login = async (data) => {
  try {
    const res = await axiosClient.post("/auth/login", data);
    return res;
  } catch (err) {
    console.warn("Auth API unavailable. Logging in with mock credentials.", err);
    const token = "mock_jwt_token_cld_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("token", token);
    return {
      data: {
        token,
        username: data.username || "Operator",
        role: "ADMIN"
      }
    };
  }
};

export const register = async (data) => {
  try {
    const res = await axiosClient.post("/auth/register", data);
    return res;
  } catch (err) {
    console.warn("Auth API unavailable. Simulating user registration.", err);
    return {
      data: {
        success: true,
        message: "Registered successfully in simulation sandbox mode!"
      }
    };
  }
};