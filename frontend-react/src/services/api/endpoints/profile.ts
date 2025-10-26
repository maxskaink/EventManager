import axiosInstance from "../axios-instance";

async function getProfile() {
  const response = await axiosInstance.get<ProfileAPI.GetProfileRes>('/profile');
  return response.data[0]; // API returns array, we take the first element
}

async function updateProfile(data: Payloads.UpdateProfile) {
  const response = await axiosInstance.put<ProfileAPI.UpdateProfileRes>('/profile', data);
  return response.data;
}

export default {
  getProfile,
  updateProfile,
};
