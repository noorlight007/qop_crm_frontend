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
    // getOrgSingleCase: builder.query({
    //   query: ({ case_alias }) => ({
    //     url: `/cases/${case_alias}/`,
    //     method: "GET",
    //   }),
    //   providesTags: ["OrgCases", "LeadDetails"],
    // }),
  }),
});

export const { useGetOrgCasesQuery } = OrgCasesApi;
