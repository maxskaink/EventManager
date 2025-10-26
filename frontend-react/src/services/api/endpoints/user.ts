import axiosInstance from "../axios-instance";

async function getUser() {
  const response = await axiosInstance.get<API.User>("/api/user");
  return response.data;
}

export default {
  getUser,
};
