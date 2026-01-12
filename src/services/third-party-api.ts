import axios from "axios";

export const apiAddress = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GET_ADDRESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
