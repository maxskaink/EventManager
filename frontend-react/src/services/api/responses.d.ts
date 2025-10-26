/**
 * @file responses.d.ts
 * This file is used to define all the responses from the api
 */
namespace AuthAPI {
  type GoogleCallbackRes = {
    user: API.User,
    access_token: string
  }
}
