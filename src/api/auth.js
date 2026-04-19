import api from "../lib/axios";

export const registerApi = (data) =>
  api.post("/auth/register", data);

export const loginApi = (data) =>
  api.post("/auth/login", data);

export const googleLoginApi = (idToken) =>
  api.post("/auth/google", { idToken });