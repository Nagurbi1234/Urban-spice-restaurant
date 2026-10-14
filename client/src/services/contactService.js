import api from "./api";

export const sendContactMessage = (data) => api.post("/contact", data).then((res) => res.data);
export const subscribeNewsletter = (email) => api.post("/newsletter", { email }).then((res) => res.data);
