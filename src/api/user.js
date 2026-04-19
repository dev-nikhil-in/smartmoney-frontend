import api from "../lib/axios";

export const getProfileApi = () =>
  api.get("/users/me");

export const changePasswordApi = (data) =>
  api.patch("/users/me/password", data);