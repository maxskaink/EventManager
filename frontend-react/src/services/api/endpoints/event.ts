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

/*
async function listEnrollments(eventId: number) {
  const response = await axiosInstance.get<EventAPI.ListParticipationsRes>(`/event/${eventId}/participation`);
  return response.data.participations;
}
*/

async function listAllEnrollements() {
  const response = await axiosInstance.get<EventAPI.ListParticipationsRes>(`/event/participation`);
  return response.data.participations;
}

async function listEnrollmentsByEvent(eventId: number) {
  const response = await axiosInstance.get<EventAPI.ListParticipationsRes>(`/event/${eventId}/participation`);
  return response.data.participations;
}

async function listEnrollmentsByUser(userId: number) {
  const response = await axiosInstance.get<EventAPI.ListParticipationsRes>(`/event/participation/user/${userId}`);
  return response.data.participations;
}

async function markAttendance(eventId: number, userIds: number[]) {
  const response = await axiosInstance.post<EventAPI.MarkAttendanceRes>(`/event/${eventId}/attend`, { users: userIds });
  return response.data;
}

async function markAbscense(eventId: number, userIds: number[]) {
  const response = await axiosInstance.post<EventAPI.MarkAttendanceRes>(`/event/${eventId}/absent`, { users: userIds });
  return response.data;
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
  listAllEnrollements,
  listEnrollmentsByEvent,
  listEnrollmentsByUser,
  markAttendance,
  markAbscense,
};
