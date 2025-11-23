export type ContentItem = {
  id: string;
  type: string;
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
};

export type ItemToDelete = {
  id: string;
  type: string;
  title: string;
};