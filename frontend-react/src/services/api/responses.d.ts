/**
 * @file responses.d.ts
 * This file is used to define all the responses from the api
 */



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