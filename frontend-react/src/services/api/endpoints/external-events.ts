import axiosInstance from "../axios-instance";

async function listAllExternalEvents() {
    const response = await axiosInstance.get<{ events: API.ExternalEvent[] }>('/external-event/all');
    return response.data;
}

async function listUserExternalEvents(user_id: number) {
    const response = await axiosInstance.get<{ external_events: API.ExternalEvent[] }>(`/external-event/user/${user_id}`);
    return response.data;
}

async function listMyExternalEvents() {
    const response = await axiosInstance.get<{ external_events: API.ExternalEvent[] }>(`/external-event/my`);
    return response.data;
}

async function listExternalEventsByDateRange(start_date: string | null, end_date: string | null) {
    const response = await axiosInstance.get<{ external_events: API.ExternalEvent[] }>('/external-event/date-range', {
        params: {
            start_date,
            end_date
        }
    });
    return response.data;
}

async function createExternalEvent(event: APIPayloads.CreateExternalEvent) {
    const response = await axiosInstance.post<{ external_event: API.ExternalEvent }>('/external-event', event);
    return response.data;
}

async function patchExternalEvent(event_id: number, event: APIPayloads.PatchExternalEvent) {
    const response = await axiosInstance.patch<{ external_event: API.ExternalEvent }>(`/external-event/${event_id}`, event);
    return response.data;
}

async function deleteExternalEvent(event_id: number) {
    const response = await axiosInstance.delete<{ external_event: API.ExternalEvent }>(`/external-event/${event_id}`);
    return response.data;
}


async function getTrustedOrganizations() {
    const response = await axiosInstance.get<{ trusted_organizations: string[] }>(`/external-event/organizations`);
    return response.data;
}


export default {
    listAllExternalEvents,
    listUserExternalEvents,
    listMyExternalEvents,
    listExternalEventsByDateRange,
    createExternalEvent,
    patchExternalEvent,
    deleteExternalEvent,
    getTrustedDomains: getTrustedOrganizations
}
