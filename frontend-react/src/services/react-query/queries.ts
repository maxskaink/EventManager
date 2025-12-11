import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { ArticleAPI, CertificateAPI, EventAPI, ExternalEventsAPI, ProfileAPI, PublicationAPI, UserAPI } from "../api";

export const eventQueries = {
    all: () =>
        queryOptions({
            queryKey: ["events"],
            queryFn: async () => {
                const data = await EventAPI.listAllEvents();
                return Array.isArray(data) ? data : [];
            },
        }),
};

export const publicationQueries = {
    all: (filters?: PublicationAPI.ListPublicationsFilters) =>
        queryOptions({
            queryKey: ["publications", filters],
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                const response = await PublicationAPI.listAllPublications({
                    page: pageParam,
                    per_page: 9, // Using 9 for grid layout (3x3)
                });
                return response;
            },
        }),
    published: (filters?: PublicationAPI.ListPublicationsFilters) => 
        queryOptions({
            queryKey: ["publications", "published", filters],
            queryFn: async () => {
                const response = await PublicationAPI.listPublicationsByFilters({ ...filters, status: 'activo' });
                return response.data || [];
            },
        }),
    draft: (filters?: PublicationAPI.ListPublicationsFilters) =>
        queryOptions({
            queryKey: ["publications", "draft", filters],
            queryFn: async () => {
                const response = await PublicationAPI.listPublicationsByFilters({ ...filters, status: 'borrador' });
                return response.data || [];
            },
        }),
    infinite: (filters?: Omit<PublicationAPI.ListPublicationsFilters, 'page'>) =>
        infiniteQueryOptions({
            queryKey: ["publications", "infinite", filters],
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                const response = await PublicationAPI.listPublicationsByFilters({
                    ...filters,
                    page: pageParam,
                    per_page: 10,
                });
                return response;
            },
            getNextPageParam: (lastPage: PaginatedResponse<API.Publication>) => {
                return lastPage.current_page < lastPage.last_page
                    ? lastPage.current_page + 1
                    : undefined;
            },
        }),
    
};

export const userQueries = {
    all: (filters?: UserAPI.ListUsersFilters) =>
        queryOptions({
            queryKey: ["users", filters],
            queryFn: async () => {
                const response = await UserAPI.listUsersByFilters(filters || {});
                return response.data || [];
            },
        }),
    active: (filters?: UserAPI.ListUsersFilters) =>
        queryOptions({
            queryKey: ["users", "active", filters],
            queryFn: async () => {
                const response = await UserAPI.listUsersByFilters({ ...filters, status: 'active' });
                return response.data || [];
            },
        }),
    inactive: (filters?: UserAPI.ListUsersFilters) =>
        queryOptions({
            queryKey: ["users", "inactive", filters],
            queryFn: async () => {
                const response = await UserAPI.listUsersByFilters({ ...filters, status: 'inactive' });
                return response.data || [];
            },
        }),
    byRole: (role: string, filters?: UserAPI.ListUsersFilters) =>
        queryOptions({
            queryKey: ["users", "role", role, filters],
            queryFn: async () => {
                const response = await UserAPI.listUsersByFilters({ ...filters, role });
                return response.data || [];
            },
        }),
    infinite: (filters?: Omit<UserAPI.ListUsersFilters, 'page'>) =>
        infiniteQueryOptions({
            queryKey: ["users", "infinite", filters],
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                const response = await UserAPI.listUsersByFilters({
                    ...filters,
                    page: pageParam,
                    per_page: 10,
                });
                return response;
            },
            getNextPageParam: (lastPage: PaginatedResponse<API.User>) => {
                return lastPage.current_page < lastPage.last_page
                    ? lastPage.current_page + 1
                    : undefined;
            },
        }),
};

export const profileQueries = {
    interests: () => queryOptions({
            queryKey: ["profile", "interests"],
            queryFn: () => ProfileAPI.getInterests(),
        }),
    user: () => queryOptions({
            queryKey: ["profile", "user"],
            queryFn: () => ProfileAPI.getProfile(),
        }),
}


export const certificateQueries = {
    my: () => queryOptions({
            queryKey: ["certificates"],
            queryFn: async () => {
                const data = await CertificateAPI.listMyCertificates()
                return data.certificates ?? [];
            },
        }),
    trustedOrganizations: () => queryOptions({
        queryKey: ["certificates", "trusted-organizations"],
        queryFn: async () => {
            const data = await CertificateAPI.listTrustedOrganizations();
            return data.trusted_organizations.sort((a, b) => a.localeCompare(b)) || [];
        },
    }),
}

export const articleQueries = {
    trustedOrganizations: () => queryOptions({
        queryKey: ["articles", "trusted-organizations"],
        queryFn: async () => {
            const data = await ArticleAPI.listTrustedOrganizations();
            return data.sort((a, b) => a.localeCompare(b)) || [];
        },
    }),
}


export const externalEventQueries = {
    trustedDomains: (enabled?: boolean) => queryOptions({
        queryKey: ["external-events", "trusted-domains"],
        queryFn: async () => {
            const data = await ExternalEventsAPI.getTrustedDomains();
            return data.trusted_organizations.sort((a, b) => a.localeCompare(b)) || [];
        },
        enabled: enabled ?? true,
    }),   
}