/**
 * This file is used to define all entities given from the api
 * @file entities.d.ts
 */
namespace API {
  interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    google_id: string;
    avatar: string;
    role: string;
    last_login_at: null | string;
    deleted_at: null | string;
    created_at: string;
    updated_at: string;
  }
}
