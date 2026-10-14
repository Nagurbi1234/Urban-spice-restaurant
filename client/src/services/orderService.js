import api, { normalize } from "./api";

export const getOrders = () => api.get("/orders").then((res) => normalize(res.data));
export const getOrder = (id) => api.get(`/orders/${id}`).then((res) => normalize(res.data));
export const createOrder = (data) => api.post("/orders", data).then((res) => normalize(res.data));
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((res) => normalize(res.data));
export const deleteOrder = (id) => api.delete(`/orders/${id}`).then((res) => res.data);
