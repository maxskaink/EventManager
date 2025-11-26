import axiosInstance from "../axios-instance";

async function addEvent(data: APIPayloads.AddEvent) {
  const response = await axiosInstance.post<{ message: string; event: API.Event }>('/event', data);
  return response.data.event;
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

async function deleteEvent(eventId: number) {
  const response = await axiosInstance.delete<MessageRes>(`/event/${eventId}`);
  return response.data;
}

// ------ PARTICIPATIONS ----------
async function enroll(eventId: number) {
  const response = await axiosInstance.post<EventAPI.MutateParticipationRes>(`/event/${eventId}/participation`);
  return response.data;
}

async function cancelEnrollment(eventId: number) {
  const response = await axiosInstance.delete<EventAPI.MutateParticipationRes>(`/event/${eventId}/participation`);
  return response.data;
}

async function listEnrollments(eventId: number) {
  const response = await axiosInstance.get<EventAPI.ListParticipationsRes>(`/event/${eventId}/participation`);
  return response.data.participations;
}

export default {
  addEvent,
  listAllEvents,
  listUpcomingEvents,
  listPastEvents,
  getEventById,
  deleteEvent,
  enroll,
  cancelEnrollment,
  listEnrollments,
};
