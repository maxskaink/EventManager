/**
 * This file is used to define all entities given from the api
 * @file entities.d.ts
 */
namespace API {
  type UserRole = 'interested' | 'member' | 'coordinator' | 'mentor';
  type EventModality = 'presencial' | 'virtual' | 'mixta';
  type EventStatus = 'activo' | 'inactivo' | 'pendiente' | 'cancelado';

  interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    google_id: string | null;
    avatar: string | null;
    role: UserRole;
    last_login_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  }

  interface Profile {
    id: number;
    user_id: number;
    university: string | null;
    academic_program: string | null;
    phone: string | null;
  }

  interface Event {
    id: number;
    name: string;
    description: string;
    start_date: string; // ISO 8601 format
    end_date: string;   // ISO 8601 format
    event_type: string;
    modality: EventModality;
    location: string | null;
    status: EventStatus;
    capacity: number | null;
    created_at: string;
    updated_at: string;
  }

  interface Certificate {
    id: number;
    user_id: number;
    name: string;
    description: string;
    issue_date: string; // YYYY-MM-DD
    document_url: string | null;
    comment: string | null;
    deleted: boolean;
    created_at: string;
    updated_at: string;
  }

  interface Article {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    publication_date: string; // YYYY-MM-DD
    authors: string;
    publication_url: string | null;
    created_at: string;
    updated_at: string;
  }
}
