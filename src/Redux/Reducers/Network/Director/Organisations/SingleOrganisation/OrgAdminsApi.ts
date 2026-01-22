import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgAdminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgAdmins: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params,
      }),
      providesTags: ["OrgAdmins"],
    }),
  }),
});

export const { useGetOrgAdminsQuery } = OrgAdminsApi;