import axiosInstance from "../axios-instance"

// TODO: Delete when fixed in backend
const mapTrustedOrgs = (orgs: unknown[]) => {
    const trustedOrgs = orgs as (API.TrustedOrg & { trusted_for_publication: boolean })[];
    return trustedOrgs.map(org => ({
        ...org,
        trusted_for_article: org.trusted_for_publication,
    }));
}

const listAllTrustedOrganizations = async () => {
    const response = await axiosInstance.get<{
        trusted_orgs: API.TrustedOrg[]
    }>("/trusted-org/all");
    return mapTrustedOrgs(response.data.trusted_orgs);
}

const listTrustedOrganizations = async (type: API.TrustedOrgType) => {
    const response = await axiosInstance.get<{
        trusted_orgs: API.TrustedOrg[]
    }>(`/trusted-org/type/${type}`);
    return mapTrustedOrgs(response.data.trusted_orgs);
}

const addTrustedOrganization = async (body: {
    org: string;
    trusted_for_certificate: boolean;
    trusted_for_event: boolean;
    trusted_for_article: boolean;
}) => {
    const response = await axiosInstance.post<MessageRes>("/trusted-org", {
        ...body,
        // TODO: Delete when fixed in backend
        trusted_for_publication: body.trusted_for_article,
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
        // TODO: Delete when fixed in backend
        trusted_for_publication: body.trusted_for_article,
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