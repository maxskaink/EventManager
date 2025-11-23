import { queryOptions } from "@tanstack/react-query";
import { EventAPI, PublicationAPI } from "../api";

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
};
