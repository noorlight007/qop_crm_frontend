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
    updateAuthUserDetails: builder.mutation({
      query: ({ payload, userAlias }) => ({
        url: `/auth/user-list/${userAlias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AuthUsers"],
    }),
  }),
});
export const { useGetAuthUsersQuery, useUpdateAuthUserDetailsMutation } =
  AuthUsersApi;
