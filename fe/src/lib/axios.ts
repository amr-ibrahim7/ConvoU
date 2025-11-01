
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})