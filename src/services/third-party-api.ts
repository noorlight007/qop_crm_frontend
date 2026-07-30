import axios from "axios";

export const apiAddress = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GET_ADDRESS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
