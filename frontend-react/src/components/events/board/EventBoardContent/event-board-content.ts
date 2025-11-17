
// Definir tipos locales
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
};

export type ItemToDelete = {
  id: string;
  type: string;
  title: string;
};