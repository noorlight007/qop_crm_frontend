import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgClients: builder.query({
      query: ({ organisationslug }) => ({
        url: `/dashboard/organization/${organisationslug}/clients/`,
        method: "GET",
      }),
      providesTags: ["OrgClients"],
    }),
  }),
});

export const { useGetOrgClientsQuery } = OrgClientsApi;