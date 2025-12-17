import { baseApi } from "@/Redux/Api/BaseApi";

export const LoginHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoginHistory: builder.query({
      query: () => ({
        url: "/dashboard/login-history/",
        method: "GET",
      }),
      providesTags: ["LoginHistory"],
    }),
  }),
});
export const { useGetLoginHistoryQuery } = LoginHistoryApi;
