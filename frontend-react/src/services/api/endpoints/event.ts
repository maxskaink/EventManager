import axiosInstance from "../axios-instance";

async function addEvent(data: Payloads.AddEvent) {
  const response = await axiosInstance.post<MessageRes>('/event', data);
  return response.data;
}

async function listAllEvents() {
  const response = await axiosInstance.get<{ events: API.Event[] }>('/event/all');
  return response.data.events;
}

async function listUpcomingEvents() {
  const response = await axiosInstance.get<{ events: API.Event[] }>('/event/active');
  return response.data.events;
}

async function listPastEvents() {
  const response = await axiosInstance.get<{ events: API.Event[] }>('/event/past');
  return response.data.events;
}

async function getEventById(eventId: number) {
  const response = await axiosInstance.get<{ event: API.Event }>(`/event/${eventId}`);
  return response.data.event;
}

export default {
  addEvent,
  listAllEvents,
  listUpcomingEvents,
  listPastEvents,
  getEventById,
};
