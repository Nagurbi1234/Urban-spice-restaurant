import api, { normalize } from "./api";

export const getReservations = () => api.get("/reservations").then((res) => normalize(res.data));
export const createReservation = (data) => api.post("/reservations", data).then((res) => normalize(res.data));
export const updateReservation = (id, data) =>
  api.put(`/reservations/${id}`, data).then((res) => normalize(res.data));
export const deleteReservation = (id) => api.delete(`/reservations/${id}`).then((res) => res.data);
