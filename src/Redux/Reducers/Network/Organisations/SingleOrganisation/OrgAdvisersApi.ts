import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgAdvisersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgAdvisers: builder.query({
      query: ({ organisationslug }) => ({
        url: `/dashboard/organization/${organisationslug}/advisers/`,
        method: "GET",
      }),
      providesTags: ["OrgAdvisers"],
    }),
  }),
});

export const { useGetOrgAdvisersQuery } = OrgAdvisersApi;