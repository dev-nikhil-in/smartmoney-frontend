import api from "../lib/axios";

export const registerApi = (data) =>
  api.post("/api/v1/auth/register", data);

export const loginApi = (data) =>
  api.post("/api/v1/auth/login", data);