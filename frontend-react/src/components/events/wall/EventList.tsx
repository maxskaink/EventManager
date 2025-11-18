import React from "react";
import { EventCard, type TransformedEvent } from "./EventCard";

interface Props {
  events: TransformedEvent[];
  hasUser: boolean;
  onRegister: (eventId: string, eventTitle: string) => void;
}

export const EventList: React.FC<Props> = ({ events, hasUser, onRegister }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} hasUser={hasUser} onRegister={onRegister} />
      ))}
    </div>
  );
};
