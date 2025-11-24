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

async function getInterests() {
  const response = await axiosInstance.get<{ interests: API.Interest[] }>('/profile/interests');
  return response.data.interests;
}

async function addInterest() {
  const response = await axiosInstance.post<{
    interest: API.Interest[]
  }>("/profile/interests");
  return response.data;
}

async function deleteInterest(interest_id: number) {
  const response = await axiosInstance.delete<{ interest: API.Interest[] }>(`/profile/interests/${interest_id}`);
  return response.data;
}

export default {
  getProfile,
  updateProfile,
  getInterests,
  addInterest,
  deleteInterest,
};
