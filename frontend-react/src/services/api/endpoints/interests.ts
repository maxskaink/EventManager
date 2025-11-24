import axiosInstance from "../axios-instance";

/**
 * Endpoints used for managing interests as admin
 * @file interests.ts
 */
async function addInterest(interest: APIPayloads.AddInterest) {
    const response = await axiosInstance.post<{ interest: API.Interest[] }>("/interest", interest);
    return response.data;
}

async function listInterests() {
    const response = await axiosInstance.get<{ interests: API.Interest[] }>("/interest/all");
    return response.data;
}

async function deleteInterest(interest_id: number) {
    const response = await axiosInstance.delete<{ interest: API.Interest[] }>(`/interest/${interest_id}`);
    return response.data;
}


export default {
    addInterest,
    listInterests,
    deleteInterest
}