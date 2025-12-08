import axiosInstance from "../axios-instance";

// GET
async function getPublicationById(id: number) {
  const respnose = await axiosInstance.get(`/publication/${id}`);
  return respnose.data.publication;
}

async function listAllPublications(params: { page?: number, per_page?: number}) {
  const response = await axiosInstance.get<PublicationAPI.ListPublicationsRes>('/publication/all', { params });
  return response.data.publications;
}

async function listPublicationsByFilters(filters: PublicationAPI.ListPublicationsFilters) {
  const response = await axiosInstance.get<PublicationAPI.ListPublicationsRes>('/publication/filter', { params: filters });
  return response.data.publications;
}

async function listPublishedPublications() {
  const response = await axiosInstance.get<PublicationAPI.ListPublicationsRes>('/publication/active');
  return response.data.publications;
}

async function listDraftPublications() {
  const response = await axiosInstance.get<PublicationAPI.ListPublicationsRes>('/publication/draft');
  return response.data.publications;
}

// POST
async function createPublication(publication: APIPayloads.CreatePublication) {

  const response = await axiosInstance.postForm<{ publication: API.Publication }>('/publication', publication);
  return response.data.publication;
}

async function addEventPublication(eventId: number, publication: APIPayloads.CreatePublication) {
  const response = await axiosInstance.postForm<{ publication: API.Publication }>(`/publication/event/${eventId}`, publication);
  return response.data.publication;
}

async function addPublicationInterests(publicationId: number, interests: number[]) {
  const response = await axiosInstance.post(`/publication/${publicationId}/interests`, { interests });
  return response.data;
}

async function setPublicationImage(publicationId: number, image: File) {
  const formData = new FormData();
  formData.append('image', image);
  const response = await axiosInstance.postForm(`/publication/${publicationId}/image`, formData);
  return response.data.publication;
}

async function grantPublicationAccess(publicationId: number, userIds: number[] | undefined, roles: string[] | undefined) {
  const response = await axiosInstance.post(`/publication/${publicationId}/access/grant`, { user_ids: userIds, roles });
  return response.data;
}


// PATCH
async function updatePublication(publicationId: number, publication: APIPayloads.UpdatePublication) {
  const response = await axiosInstance.patch<{ publication: API.Publication }>(`/publication/${publicationId}`, publication);
  return response.data.publication;
}

// DELETE
async function removePublicationInterests(publicationId: number, interests: number[]) {
  const response = await axiosInstance.delete(`/publication/${publicationId}/interests`, { data: { interests } });
  return response.data;
}

async function revokePublicationAccess(publicationId: number, userIds: number[] | undefined, roles: string[] | undefined) {
  const response = await axiosInstance.delete(`/publication/${publicationId}/access/revoke`, { data: { user_ids: userIds, roles } });
  return response.data;
}

// MOCK: Get access list (simulated)
async function getPublicationAccess(publicationId: number) {


  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return fake data based on ID to be consistent but varied
  const mockUsers = [
    { id: 101, name: "Juan Pérez", email: "juan@example.com", role: "mentor", avatar: null as string | null },
    { id: 102, name: "Maria Garcia", email: "maria@example.com", role: "coordinator", avatar: null as string | null },
    { id: 103, name: "Carlos Lopez", email: "carlos@example.com", role: "member", avatar: null as string | null },
  ];

  if (publicationId % 2 === 0) {
    return { users: mockUsers, roles: ["mentor"] };
  } else {
    return { users: [mockUsers[0]], roles: [] };
  }
}

export default {
  listAllPublications,
  listPublishedPublications,
  listDraftPublications,
  getPublicationById,
  createPublication,
  addEventPublication,
  addPublicationInterests,
  setPublicationImage,
  grantPublicationAccess,
  updatePublication,
  removePublicationInterests,
  revokePublicationAccess,
  listPublicationsByFilters,
  getPublicationAccess
};
