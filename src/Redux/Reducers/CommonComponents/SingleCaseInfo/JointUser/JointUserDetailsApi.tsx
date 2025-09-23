import { baseApi } from "@/Redux/Api/BaseApi";

export const JointUserDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJointUserInfo: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/joint/users/`,
        method: "GET",
      }),
      providesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointUserDetails",
        "ExistingProtectionDetails",
        "PortfolioDetails",
      ],
    }),
    addJointUserInfo: builder.mutation({
      query: ({ case_alias, jointuserInfo }) => ({
        url: `/cases/${case_alias}/joint/users/`,
        method: "POST",
        body: jointuserInfo,
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointUserDetails",
        "ExistingProtectionDetails",
        "PortfolioDetails",
      ],
    }),
    updateJointUserInfo: builder.mutation({
      query: ({ case_alias, userAlias, updatedJointuserInfo }) => ({
        url: `/cases/${case_alias}/joint/users/${userAlias}/`,
        method: "PUT",
        body: updatedJointuserInfo,
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointUserDetails",
        "ExistingProtectionDetails",
        "PortfolioDetails",
      ],
    }),
    deleteJointUserInfo: builder.mutation({
      query: ({ case_alias, userAlias }) => ({
        url: `/cases/${case_alias}/joint/users/${userAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointUserDetails",
        "ExistingProtectionDetails",
        "PortfolioDetails",
      ],
    }),
  }),
});

export const {
  useGetJointUserInfoQuery,
  useAddJointUserInfoMutation,
  useUpdateJointUserInfoMutation,
  useDeleteJointUserInfoMutation,
} = JointUserDetailsApi;
