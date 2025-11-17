import axiosInstance from "../axios-instance";

// GET
async function getPublicationById(id: number) {
  const respnose = await axiosInstance.get(`/publication/${id}`);
  return respnose.data.publication;
}

async function listAllPublications() {
  const response = await axiosInstance.get<{ publications: API.Publication[] }>('/publication/all');
  return response.data.publications;
}

async function listPublishedPublications() {
  const response = await axiosInstance.get<{ publications: API.Publication[] }>('/publication/active');
  return response.data.publications;
}

async function listDraftPublications() {
  const response = await axiosInstance.get<{ publications: API.Publication[] }>('/publication/draft');
  return response.data.publications;
}

// POST
async function createPublication(publication: APIPayloads.CreatePublication) {
  
  const response = await axiosInstance.postForm<{ publication: API.Publication }>('/publication', publication);
  return response.data.publication;
}

// PUT

// PATCH

export default {
  listAllPublications,
  listPublishedPublications,
  listDraftPublications,
  getPublicationById,
  createPublication
};

