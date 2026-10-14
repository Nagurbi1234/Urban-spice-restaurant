import api, { normalize } from "./api";

export const getMenu = (params) => api.get("/menu", { params }).then((res) => normalize(res.data));
export const getMenuItem = (id) => api.get(`/menu/${id}`).then((res) => normalize(res.data));
export const createMenuItem = (data) => api.post("/menu", data).then((res) => normalize(res.data));
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data).then((res) => normalize(res.data));
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`).then((res) => res.data);
