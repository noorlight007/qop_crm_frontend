import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgCasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgCases: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/api/organisations/${organisationslug}/cases/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgCases", "LeadDetails"],
    }),
    getOrgCaseDetails: builder.query({
      query: ({ organisationslug, case_alias }) => ({
        url: `/api/organisations/${organisationslug}/cases/${case_alias}/`,
        method: "GET",
      }),
      providesTags: ["OrgCases"],
    }),
    addOrgCase: builder.mutation({
      query: ({ organisationslug, payload }) => ({
        url: `/api/organisations/${organisationslug}/cases/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrgCases", "OrgApplicantList"],
    }),
    updateOrgCase: builder.mutation({
      query: ({ organisationslug, case_alias, payload }) => ({
        url: `/api/organisations/${organisationslug}/cases/${case_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["OrgCases", "OrgApplicantList"],
    }),
    deleteOrgCase: builder.mutation({
      query: ({ organisationslug, case_alias }) => ({
        url: `/api/organisations/${organisationslug}/cases/${case_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgCases", "OrgApplicantList"],
    }),
  }),
});

export const {
  useGetOrgCasesQuery,
  useGetOrgCaseDetailsQuery,
  useAddOrgCaseMutation,
  useUpdateOrgCaseMutation,
  useDeleteOrgCaseMutation,
} = OrgCasesApi;
