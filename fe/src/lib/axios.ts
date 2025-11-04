
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// import axios from 'axios';

// export const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
// })

import axios from "axios";



export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "production" 
    ? ""
    : "http://localhost:5001",
  withCredentials: true,
});