import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgLeadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgLeads: builder.query({
      query: ({ organisationslug }) => ({
        url: `/dashboard/organization/${organisationslug}/leads/`,
        method: "GET",
      }),
      providesTags: ["OrgLeads"],
    }),
  }),
});

export const { useGetOrgLeadsQuery } = OrgLeadsApi;
