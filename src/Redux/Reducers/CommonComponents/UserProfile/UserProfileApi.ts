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
  }),
});

export const { useGetUserDetailsQuery, useUpdateUserDetailsMutation } =
  UserProfileApi;
