import { Navigate, useParams } from "react-router";
import { EventDetailScreen } from "../events/EventDetailScreen";

export default function EventDetailWrapper() {
  const params = useParams();
  const eventId = params.eventId ?? "";
  if (!eventId) return <Navigate to="/events" replace />;
  return <EventDetailScreen eventId={eventId} />;
}
