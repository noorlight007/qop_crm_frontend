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
    addAuthUser: builder.mutation({
      query: ({ payload }) => ({
        url: "/auth/user-list/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AuthUsers"],
    }),
    updateAuthUserDetails: builder.mutation({
      query: ({ payload, userAlias }) => ({
        url: `/auth/user-list/${userAlias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AuthUsers"],
    }),
    deleteAuthUser: builder.mutation({
      query: ({ userAlias }) => ({
        url: `/auth/user-list/${userAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AuthUsers"],
    }),
  }),
});
export const {
  useGetAuthUsersQuery,
  useAddAuthUserMutation,
  useUpdateAuthUserDetailsMutation,
  useDeleteAuthUserMutation,
} = AuthUsersApi;
