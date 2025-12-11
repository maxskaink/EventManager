import axiosInstance from "../axios-instance"


const listAllTrustedOrganizations = async () => {
    const response = await axiosInstance.get<{
        trusted_orgs: API.TrustedOrg[]
    }>("/trusted-org/all");
    return response.data.trusted_orgs;
}

const listTrustedOrganizations = async (type: API.TrustedOrgType) => {
    const response = await axiosInstance.get<{
        trusted_orgs: API.TrustedOrg[]
    }>(`/trusted-org/type/${type}`);
    return response.data.trusted_orgs
}

const addTrustedOrganization = async (body: {
    org: string;
    trusted_for_certificate: boolean;
    trusted_for_event: boolean;
    trusted_for_article: boolean;
}) => {
    const response = await axiosInstance.post<MessageRes>("/trusted-org", {
        ...body,
    });
    return response.data;
}


const updateTrustedOrganization = async (id: number, body: {
    org: string;
    trusted_for_certificate: boolean;
    trusted_for_event: boolean;
    trusted_for_article: boolean;
}) => {
    const response = await axiosInstance.patch<MessageRes>(`/trusted-org/${id}`, {
        ...body,
    });
    return response.data;
}

const deleteTrustedOrganization = async (id: number) => {
    const response = await axiosInstance.delete<MessageRes>(`/trusted-org/${id}`);
    return response.data;
}


export default {
    listAllTrustedOrganizations,
    listTrustedOrganizations,
    addTrustedOrganization,
    updateTrustedOrganization,
    deleteTrustedOrganization,
}