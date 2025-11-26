export type ContentItem = {
  id: string;
  type: string;
  subtype?: string;  // For events: "charla" | "taller" | "conferencia" | "semillero"
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  status: string;
  capacity?: number;
  enrolled?: number;
  views?: number;
  kind: 'event' | 'publication';
  original?: any;
  eventId?: string;
};

export type ItemToDelete = {
  id: string;
  type: string;
  title: string;
};