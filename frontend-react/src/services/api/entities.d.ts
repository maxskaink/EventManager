/**
 * This file is used to define all entities given from the api
 * @file entities.d.ts
 */
namespace API {
  type UserRole = "interested" | "active-member" | "coordinator" | "mentor" | "seed";
  type EventModality = 'presencial' | 'virtual' | 'mixta';
   type Role = UserRole;
   type PublicationType = "articulo" | "aviso" | "comunicado" | "material" | "evento";
   // TODO: verificar los estados de una publicación 
   type PublicationStatus = "activo" | "inactivo" | "borrador" | "pendiente";
   type PublicationVisibility = "public" | "private" | "role_based";
   type EventModality = "presencial" | "virtual" | "mixta";
   type EventStatus = "activo" | "inactivo" | "pendiente" | "cancelado";
   type EventType = "charla" | "taller" | "conferencia" | "semillero";

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
    created_at: string;
    updated_at: string;
    // Asumo que los intereses se pueden cargar aquí
    interests?: Interest[];
    // Asumo que el usuario se puede cargar aquí
    user?: User;
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
    issuing_organization: string;
    issue_date: string;
    expiration_date: string | null;
    credential_id: string | null;
    credential_url: string | null;
    does_not_expire: boolean;
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

  interface Interest {
    id: number;
    keyword: string;
  }

  interface Publication {
    id: number;
    event_id: number | null;
    title: string;
    content: string;
    type: PublicationType;
    published_at: string;
    status: PublicationStatus;
    image_url: string | null;
    summary: string | null;
    visibility: PublicationVisibility;
    created_at: string;
    updated_at: string;
  }
  interface ExternalEvent {
    id: number;
    user_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    modality: EventModality;
    host_organization: string;
    location: string;
    participation_url: string;
    created_at: string;
    updated_at: string;
  }
  
  interface Notification {
    id: string; // Las notificaciones de Laravel suelen usar UUIDs
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: Record<string, unknown>; // El contenido real de la notificación
    read_at: string | null;
    created_at: string;
    updated_at: string;
  }

  interface TrustedOrganization {
    name: string;
    // ... otros campos si los hay
  }
}
