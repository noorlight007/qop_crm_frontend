import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgAdvisersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgAdvisers: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgAdvisers"],
    }),
  }),
});

export const { useGetOrgAdvisersQuery } = OrgAdvisersApi;
