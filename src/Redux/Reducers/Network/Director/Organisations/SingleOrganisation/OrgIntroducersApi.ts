import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgIntroducersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgIntroducers: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgIntroducers"],
    }),
  }),
});

export const { useGetOrgIntroducersQuery } = OrgIntroducersApi;
