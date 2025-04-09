import axios from "axios";

const BASE_URL = "https://your-backend-service-name.onrender.com";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
