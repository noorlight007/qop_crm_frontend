import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgJointApplicant = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrgJointApplicant: build.query({
      query: ({ organisationslug, case_alias }) => ({
        url: `/organisations/${organisationslug}/cases/${case_alias}/joint-applicant/`,
        method: "GET",
      }),
      providesTags: ["OrgJointApplicant"],
    }),
  }),
});

export const { useGetOrgJointApplicantQuery } = OrgJointApplicant;
