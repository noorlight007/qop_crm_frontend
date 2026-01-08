import axios from "axios";

// Create a reusable Axios instance
const apiAddress = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_THIRD_PARTY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAddress;