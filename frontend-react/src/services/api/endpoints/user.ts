import axiosInstance from "../axios-instance";

async function getUser() {
  const response = await axiosInstance.get<UserAPI.GetUserRes>("/api/user");
  return response.data;
}

async function toggleUserRole(userId: number, newRole: API.UserRole) {
  const response = await axiosInstance.patch<MessageRes>(`/user/${userId}/toggle-role`, { new_role: newRole });
  return response.data;
}

async function listActiveUsers() {
  const response = await axiosInstance.get<UserAPI.ListUsersRes>('/user/active');
  return response.data;
}

async function listActiveMembers() {
  const response = await axiosInstance.get<UserAPI.ListUsersRes>('/user/member');
  return response.data;
}

async function listActiveInterested() {
    const response = await axiosInstance.get<UserAPI.ListUsersRes>('/user/interested');
    return response.data;
}

async function listActiveCoordinators() {
    const response = await axiosInstance.get<UserAPI.ListUsersRes>('/user/coordinator');
    return response.data;
}

async function listActiveMentors() {
    const response = await axiosInstance.get<UserAPI.ListUsersRes>('/user/mentor');
    return response.data;
}

async function listInactiveUsers() {
  const response = await axiosInstance.get<UserAPI.ListUsersRes>('/user/inactive');
  return response.data;
}

export default {
  getUser,
  toggleUserRole,
  listActiveUsers,
  listActiveMembers,
  listActiveInterested,
  listActiveCoordinators,
  listActiveMentors,
  listInactiveUsers
};
