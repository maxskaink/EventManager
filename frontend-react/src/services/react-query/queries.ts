import { queryOptions } from "@tanstack/react-query";
import { CertificateAPI, EventAPI, ProfileAPI, PublicationAPI } from "../api";

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
    all: () =>
        queryOptions({
            queryKey: ["publications"],
            queryFn: async () => {
                const data = await PublicationAPI.listAllPublications();
                return Array.isArray(data) ? data : [];
            },
        }),
    published: () => 
        queryOptions({
            queryKey: ["publications","published"],
            queryFn: async () => {
                const data = await PublicationAPI.listPublishedPublications();
                return Array.isArray(data) ? data : [];
            },
        }),
    draft: () =>
        queryOptions({
            queryKey: ["publications","draft"],
            queryFn: async () => {
                const data = await PublicationAPI.listDraftPublications();
                return Array.isArray(data) ? data : [];
            },
        })
    
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
}