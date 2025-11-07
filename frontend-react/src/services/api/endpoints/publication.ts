import axiosInstance from "../axios-instance";

async function listAllPublications() {
  const response = await axiosInstance.get<{ publications: any[] }>('/publication/all');
  return response.data.publications;
}

async function listPublishedPublications() {
  const response = await axiosInstance.get<{ publications: any[] }>('/publication/active');
  return response.data.publications;
}

export default {
  listAllPublications,
  listPublishedPublications,
};

