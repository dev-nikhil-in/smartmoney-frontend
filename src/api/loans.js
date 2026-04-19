import api from "../lib/axios";

export const getAllLoansApi = () =>
  api.get("/loans");

export const getLoanByIdApi = (id) =>
  api.get(`/loans/${id}`);

export const addLoanApi = (data) =>
  api.post("/loans", data);

export const updateLoanApi = (id, data) =>
  api.put(`/loans/${id}`, data);

export const deleteLoanApi = (id) =>
  api.delete(`/loans/${id}`);

export const simulateLoanApi = (id, data) =>
  api.post(`/loans/${id}/simulate`, data);