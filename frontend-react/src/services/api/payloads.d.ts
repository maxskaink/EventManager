namespace APIPayloads {
  type UpdateProfile = Partial<Pick<API.Profile, 'university' | 'academic_program' | 'phone'>>;
  type AddEvent = Omit<API.Event, 'id' | 'created_at' | 'updated_at' | 'publication_id'>;
  type AddCertificate = Omit<API.Certificate, 'id'   | 'created_at' | 'updated_at'>;
  type UpdateCertificate = Partial<Omit<AddCertificate, 'user_id'>>;
  type AddArticle = Omit<API.Article, 'id' | 'created_at' | 'updated_at'>;
  type UpdateArticle = Partial<AddArticle>;
  type AddInterest = { keyword: string };
  type AddProfileInterest = { interests: number[] };

  type PatchExternalEvent = Partial<Omit<API.ExternalEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

  interface ProfileInterests {
    interests: number[]; // Array de IDs de interés
  }

  // --- Article ---
  interface CreateArticle {
    user_id: number;
    title: string;
    description: string;
    publication_date: string;
    authors: string;
    publication_url: string;
  }

  // --- Certificate ---
  interface CreateCertificate {
    user_id: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiration_date?: string | null;
    credential_id?: string;
    credential_url?: string;
    does_not_expire?: boolean;
  }

  // --- External Event ---
  interface CreateExternalEvent {
    user_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    modality: API.EventModality;
    host_organization: string;
    location: string;
    participation_url: string;
  }

  interface UpdateExternalEvent {
    name?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    modality?: API.EventModality;
    host_organization?: string;
    location?: string;
    participation_url?: string;
  }

  // --- Interest ---
  interface CreateInterest {
    keyword: string;
  }

  // --- Publication ---
  interface CreatePublication {
    title: string;
    content: string;
    type: API.PublicationType;
    status: API.PublicationStatus;
    visibility: API.PublicationVisibility;
    image?: File;
    summary: string;
  }

  type CreateEventPublication = CreatePublication;

  interface UpdatePublication {
    title?: string;
    content?: string;
    type?: API.PublicationType;
    published_at?: string;
    status?: API.PublicationStatus;
    image_url?: string;
    summary?: string;
    visibility?: API.PublicationVisibility;
  }

  interface PublicationAccess {
    user_ids?: number[];
    roles?: API.Role[];
  }

  interface PublicationInterests {
    interests: number[]; // Array de IDs de interés
  }
}