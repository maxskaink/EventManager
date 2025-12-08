/**
 * @file responses.d.ts
 * This file is used to define all the responses from the api
 */
type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    page: null | number;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

type MessageRes = {
  message: string;
}

interface SuccessResponse<T> {
  data: T;
  message?: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
  errors?: Record<string, string[]>; // Para errores de validación de Laravel
}

// --- RESPONSES ---
namespace AuthAPI {
  type GoogleAuthUrlRes = {
    url: string;
  }
  type GoogleCallbackRes = {
    user: API.User;
    access_token: string;
  }
}

namespace UserAPI {
  type GetUserRes = {
    user: API.User;
  }
  type ListUsersRes = API.User[];
  type ListUsersPaginatedRes = PaginatedResponse<API.User>;

  type ListUsersFilters = {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }
}

namespace ProfileAPI {
  type GetProfileRes = {
    profile: API.Profile
  }
  type UpdateProfileRes = {
    message: string;
    profile: API.Profile
  }

  type AddInterestRes = {
    message: string;
    interests: API.ProfileInterest[];
  }

}

namespace EventAPI {
  type ListEventsRes = API.Event[];

  type MutateParticipationRes = {
    message: string;
    participation: API.EventParticipation;
  }

  type ListParticipationsRes = {
    participations: API.EventParticipation[];
  }

  type MarkAttendanceRes = {
    message: string;
    results: { [string]: string };
  }
}

namespace CertificateAPI {
  type ListCertificatesRes = {
    certificates: API.Certificate[];
  }
  type UpdateCertificateRes = {
    message: string;
    certificate: API.Certificate;
  }
}

namespace ArticleAPI {
  type ArticleRes = {
    message: string;
    article: API.Article;
  }
  type ListArticlesRes = {
    articles: API.Article[];
  }
}

namespace PublicationAPI {
  type ListPublicationsRes = {
    publications: PaginatedResponse<API.Publication>;
  }

  type ListPublicationsFilters = {
    search?: string;
    date_from?: string;
    date_to?: string;
    type?: API.PublicationType
    page?: number;
    per_page?: number;
  }
}