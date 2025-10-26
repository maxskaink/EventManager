import axiosInstance from "../axios-instance";

async function addEvent(data: Payloads.AddEvent) {
  const response = await axiosInstance.post<MessageRes>('/event', data);
  return response.data;
}

async function listAllEvents() {
  const response = await axiosInstance.get<EventAPI.ListEventsRes>('/event/all');
  return response.data;
}

async function listUpcomingEvents() {
  const response = await axiosInstance.get<EventAPI.ListEventsRes>('/event/active');
  return response.data;
}

async function listPastEvents() {
  const response = await axiosInstance.get<EventAPI.ListEventsRes>('/event/past');
  return response.data;
}

export default {
  addEvent,
  listAllEvents,
  listUpcomingEvents,
  listPastEvents,
};
