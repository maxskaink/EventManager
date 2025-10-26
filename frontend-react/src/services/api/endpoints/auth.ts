import axiosInstance from "../axios-instance";

async function getGoogleAuthUrl() {
  const response = await axiosInstance.get<AuthAPI.GoogleAuthUrlRes>("/auth");
  return response.data;
}

async function googleCallback(data: { code: string }) {
  const response = await axiosInstance.post<AuthAPI.GoogleCallbackRes>("/auth/callback", data);
  return response.data;
}

async function logout() {
  const response = await axiosInstance.get<MessageRes>("/logout");
  return response.data;
}

async function getAuthenticatedUser() {
  const response = await axiosInstance.get<UserAPI.GetUserRes>("/user");
  return response.data.user;
}

export default {
  getGoogleAuthUrl,
  googleCallback,
  logout,
  getAuthenticatedUser
};
