import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgClients: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/dashboard/organization/${organisationslug}/clients/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgClients"],
    }),
  }),
});

export const { useGetOrgClientsQuery } = OrgClientsApi;