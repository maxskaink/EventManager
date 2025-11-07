/**
 * @file responses.d.ts
 * This file is used to define all the responses from the api
 */

// --- PAYLOADS ---
namespace Payloads {
  type UpdateProfile = Partial<Pick<API.Profile, 'university' | 'academic_program' | 'phone'>>;
  type AddEvent = Omit<API.Event, 'id' | 'created_at' | 'updated_at'>;
  type AddCertificate = Omit<API.Certificate, 'id' | 'deleted' | 'created_at' | 'updated_at'>;
  type UpdateCertificate = Partial<Omit<AddCertificate, 'user_id'>>;
  type AddArticle = Omit<API.Article, 'id' | 'created_at' | 'updated_at'>;
  type UpdateArticle = Partial<AddArticle>;
}


// --- RESPONSES ---
type MessageRes = {
  message: string;
}

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
