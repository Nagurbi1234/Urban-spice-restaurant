import api, { normalize } from "./api";

export const getAdminSummary = () => api.get("/admin/summary").then((res) => res.data);
export const getAdminUsers = () => api.get("/admin/users").then((res) => normalize(res.data));
export const healthCheck = () => api.get("/health").then((res) => res.data);
