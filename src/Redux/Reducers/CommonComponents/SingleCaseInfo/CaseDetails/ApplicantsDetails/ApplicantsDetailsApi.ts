import { baseApi } from "@/Redux/Api/BaseApi";

export const ApplicantsDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplicants: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/applicant/details/`,
        method: "GET",
      }),
      providesTags: ["ApplicantsDetails"],
    }),
    updateApplicantDetails: builder.mutation({
      query: ({ case_alias, applicantDetails_alias, applicantDetails }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/`,
        method: "PUT",
        body: applicantDetails,
      }),
      invalidatesTags: ["ApplicantsDetails", "Dependants", "CompanyDetails"],
    }),
    addDependants: builder.mutation({
      query: ({ case_alias, applicantDetails_alias, dependantsInfo }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/dependants/`,
        method: "POST",
        body: dependantsInfo,
      }),
      invalidatesTags: ["ApplicantsDetails", "Dependants"],
    }),
    getDependants: builder.query({
      query: ({ case_alias, applicantDetails_alias }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/dependants/`,
        method: "GET",
      }),
      providesTags: ["ApplicantsDetails", "Dependants"],
    }),
    getCompanyDetails: builder.query({
      query: ({ case_alias, applicantDetails_alias }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/company/`,
        method: "GET",
      }),
      providesTags: ["ApplicantsDetails", "CompanyDetails"],
    }),
    addCompanyDetails: builder.mutation({
      query: ({ case_alias, applicantDetails_alias, CompanyDetails }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/company/`,
        method: "POST",
        body: CompanyDetails,
      }),
      invalidatesTags: ["ApplicantsDetails", "CompanyDetails"],
    }),
    updateCompanyDetails: builder.mutation({
      query: ({
        case_alias,
        applicantDetails_alias,
        company_name,
        CompanyDetails,
      }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/company/${company_name}/`,
        method: "PUT",
        body: CompanyDetails,
      }),
      invalidatesTags: ["ApplicantsDetails", "CompanyDetails"],
    }),
  }),
});

export const {
  useAddDependantsMutation,
  useGetDependantsQuery,
  useGetCompanyDetailsQuery,
  useAddCompanyDetailsMutation,
  useGetApplicantsQuery,
  useUpdateApplicantDetailsMutation,
  useUpdateCompanyDetailsMutation,
} = ApplicantsDetailsApi;
