import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  //   // credentials: "include",
  //   prepareHeaders: async (headers) => {
  //     const session = await getSession();
  //     const token = session?.user?.accessToken;

  //     if (token) {
  //       headers.set("authorization", `JWT ${token}`);
  //     }

  //     return headers;
  //   },
});
export const authBaseApi = createApi({
  reducerPath: "authBaseApi",
  baseQuery: baseQuery,
  tagTypes: ["SetPassword", "ResetPassword"],
  endpoints: () => ({}),
});
