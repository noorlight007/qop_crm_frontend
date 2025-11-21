import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});
export const authBaseApi = createApi({
  reducerPath: "authBaseApi",
  baseQuery: baseQuery,
  tagTypes: ["SetPassword", "ForgotPassword"],
  endpoints: () => ({}),
});
