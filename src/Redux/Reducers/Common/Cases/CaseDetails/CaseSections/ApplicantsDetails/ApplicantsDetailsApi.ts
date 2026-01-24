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
        method: "PATCH",
        body: applicantDetails,
      }),
      invalidatesTags: [
        "ApplicantsDetails",
        "Dependants",
        "CompanyDetails",
        "CaseDetails",
      ],
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
    deleteDependants: builder.mutation({
      query: ({ case_alias, applicantDetails_alias, dependant_id }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/dependants/${dependant_id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApplicantsDetails", "Dependants"],
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
    getCompanyDetailsByRegistration: builder.query({
      query: ({ case_alias, applicantDetails_alias, company_registration_number }) => ({
        url: `/cases/${case_alias}/applicant/details/${applicantDetails_alias}/company-address/`,
        method: "GET",
        params: { company_registration_number },
      }),
      providesTags: ["ApplicantsDetails", "CompanyDetails"],
    }),
  }),
});

export const {
  useAddDependantsMutation,
  useGetDependantsQuery,
  useDeleteDependantsMutation,
  useGetCompanyDetailsQuery,
  useAddCompanyDetailsMutation,
  useGetApplicantsQuery,
  useUpdateApplicantDetailsMutation,
  useUpdateCompanyDetailsMutation,
  useGetCompanyDetailsByRegistrationQuery,
} = ApplicantsDetailsApi;
