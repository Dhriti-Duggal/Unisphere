export const BASE_URL = "http://localhost:5001/api";

export const API = {
  login:   `${BASE_URL}/auth/login`,
  signup:  `${BASE_URL}/auth/register`,
  me:      `${BASE_URL}/users/me`,
  profile: `${BASE_URL}/users/profile`,
  users:   `${BASE_URL}/users`,
  userStatus: (id: string) => `${BASE_URL}/users/${id}/status`,
};