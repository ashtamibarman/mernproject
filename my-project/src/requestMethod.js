import axios from "axios";
const BASE_URL = "https://server-p2ja.onrender.com/";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
