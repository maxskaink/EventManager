import axiosInstance from "../axios-instance";

async function getUser() {
  const response = await axiosInstance.get<UserAPI.GetUserRes>("/api/user");
  return response.data;
}

export default {
  getUser,
};
