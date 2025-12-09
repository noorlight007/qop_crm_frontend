import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgCasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgCases: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/dashboard/organization/${organisationslug}/cases-overview/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgCases", "LeadDetails"],
    }),
  }),
});

export const { useGetOrgCasesQuery } = OrgCasesApi;
