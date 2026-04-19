import api from "../lib/axios";

export const getDashboardApi = () =>
  api.get("/dashboard");