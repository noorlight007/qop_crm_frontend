import { baseApi } from "@/Redux/Api/BaseApi";

export const LoginHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoginHistory: builder.query({
      query: (params) => ({
        url: "/dashboard/login-history/",
        method: "GET",
        params,
      }),
      providesTags: ["LoginHistory"],
    }),
  }),
});
export const { useGetLoginHistoryQuery } = LoginHistoryApi;
