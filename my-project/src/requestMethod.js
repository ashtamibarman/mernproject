import axios from "axios";

const BASE_URL = "https://backend-project-mpxb.onrender.com";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
