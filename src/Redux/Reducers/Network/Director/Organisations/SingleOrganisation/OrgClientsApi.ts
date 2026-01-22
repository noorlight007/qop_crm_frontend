import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgClients: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgClients"],
    }),
  }),
});

export const { useGetOrgClientsQuery } = OrgClientsApi;