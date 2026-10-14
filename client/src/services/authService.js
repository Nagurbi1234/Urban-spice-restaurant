import api, { normalize } from "./api";

export const registerUser = (data) =>
  api.post("/auth/register", data).then((res) => ({ ...res.data, user: normalize(res.data.user) }));
export const loginUser = (data) =>
  api.post("/auth/login", data).then((res) => ({ ...res.data, user: normalize(res.data.user) }));
export const getMe = () => api.get("/auth/me").then((res) => normalize(res.data));
