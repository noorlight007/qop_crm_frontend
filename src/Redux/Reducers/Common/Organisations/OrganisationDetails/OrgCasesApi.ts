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
      query: ({ organisationslug, data }) => ({
        url: `/dashboard/organization/${organisationslug}/cases/`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["OrgCases"],
    }),
    deleteOrgCase: builder.mutation({
      query: ({ organisationslug, case_alias }) => ({
        url: `/dashboard/organization/${organisationslug}/cases/${case_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgCases"],
    }),
  }),
});

export const {
  useGetOrgCasesQuery,
  useAddOrgCaseMutation,
  useDeleteOrgCaseMutation,
} = OrgCasesApi;
