import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgCasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgCases: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/dashboard/organization/${organisationslug}/cases/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgCases", "LeadDetails"],
    }),
    addOrgCase: builder.mutation({
      query: ({ organisationslug, payload }) => ({
        url: `/dashboard/organization/${organisationslug}/cases/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrgCases", "OrgLeadAndApplicantList"],
    }),
  }),
});

export const { useGetOrgCasesQuery, useAddOrgCaseMutation } = OrgCasesApi;
