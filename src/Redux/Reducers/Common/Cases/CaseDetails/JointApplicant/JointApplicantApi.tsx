import { baseApi } from "@/Redux/Api/BaseApi";

export const JointApplicantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJointApplicantInfo: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/joint-users/`,
        method: "GET",
      }),
      providesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointApplicantDetails",
        "ExistingProtectionDetails",
        "Portfolio",
      ],
    }),
    addJointApplicantInfo: builder.mutation({
      query: ({ case_alias, jointuserInfo }) => ({
        url: `/cases/${case_alias}/joint-users/`,
        method: "POST",
        body: jointuserInfo,
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointApplicantDetails",
        "ExistingProtectionDetails",
        "Portfolio",
      ],
    }),
    updateJointApplicantInfo: builder.mutation({
      query: ({ case_alias, userAlias, updatedJointuserInfo }) => ({
        url: `/cases/${case_alias}/joint-users/${userAlias}/`,
        method: "PATCH",
        body: updatedJointuserInfo,
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointApplicantDetails",
        "ExistingProtectionDetails",
        "Portfolio",
      ],
    }),
    deleteJointApplicantInfo: builder.mutation({
      query: ({ case_alias, userAlias }) => ({
        url: `/cases/${case_alias}/joint-users/${userAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "EmploymentDetails",
        "JointApplicantDetails",
        "ExistingProtectionDetails",
        "Portfolio",
      ],
    }),
  }),
});

export const {
  useGetJointApplicantInfoQuery,
  useAddJointApplicantInfoMutation,
  useUpdateJointApplicantInfoMutation,
  useDeleteJointApplicantInfoMutation,
} = JointApplicantApi;
