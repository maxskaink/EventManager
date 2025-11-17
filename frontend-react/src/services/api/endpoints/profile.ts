import axiosInstance from "../axios-instance";

async function getProfile() {
  const response = await axiosInstance.get<{ profile: API.Profile }>('/profile');
  // El backend devuelve { profile: {...} }, no un array
  return response.data.profile;
}

async function updateProfile(data: APIPayloads.UpdateProfile) {
  const response = await axiosInstance.patch<ProfileAPI.UpdateProfileRes>('/profile', data);
  // Devolver el perfil para que React Query pueda actualizar la caché
  return response.data.profile;
}

export default {
  getProfile,
  updateProfile,
};
