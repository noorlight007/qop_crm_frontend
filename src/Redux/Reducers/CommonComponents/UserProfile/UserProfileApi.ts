import { baseApi } from "@/Redux/Api/BaseApi";

export const UserProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: `/auth/user-profile/`,
        method: "GET",
      }),
      providesTags: ["UserProfileDetails"],
    }),

    updateUserDetails: builder.mutation({
      query: ({ payload }) => ({
        url: `/auth/user-profile/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["UserProfileDetails"],
    }),
    sendResetPasswordEmail: builder.mutation({
      query: ({ email }) => ({
        url: `/auth/users/reset_password/`,
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["UserProfileDetails"],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useSendResetPasswordEmailMutation,
} = UserProfileApi;
