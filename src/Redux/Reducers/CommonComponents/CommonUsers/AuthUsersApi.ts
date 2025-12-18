import { baseApi } from "@/Redux/Api/BaseApi";

export const AuthUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthUsers: builder.query({
      query: (params) => ({
        url: "/auth/user-list/",
        method: "GET",
        params,
      }),
      providesTags: ["AuthUsers"],
    }),
  }),
});
export const { useGetAuthUsersQuery } = AuthUsersApi;
