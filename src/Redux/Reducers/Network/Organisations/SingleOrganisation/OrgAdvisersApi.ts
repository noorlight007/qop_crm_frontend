import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgAdvisersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgAdvisers: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/dashboard/organization/${organisationslug}/advisers/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgAdvisers"],
    }),
  }),
});

export const { useGetOrgAdvisersQuery } = OrgAdvisersApi;
