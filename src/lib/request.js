import axios from "axios";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const request = axios.create({ baseURL: API_URL });

request.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 403) {
      localStorage.removeItem("token");
      window.location.reload();
    }

    return Promise.reject(error.response.data);
  }
);

export default request;
