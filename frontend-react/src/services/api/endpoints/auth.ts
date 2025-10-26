import axiosInstance from "../axios-instance";

async function googleCallback(data: { code: string }) {
  const response = await axiosInstance.post<AuthAPI.GoogleCallbackRes>("/api/auth/callback", data);
  return response.data;
}

async function logout() {
  const response = await axiosInstance.get("/api/logout")
  return response.data
}

export default {
  googleCallback,
  logout
};
