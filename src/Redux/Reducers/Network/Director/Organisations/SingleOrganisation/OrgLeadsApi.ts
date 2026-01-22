import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgLeadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgLeads: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgLeads"],
    }),
  }),
});

export const { useGetOrgLeadsQuery } = OrgLeadsApi;
