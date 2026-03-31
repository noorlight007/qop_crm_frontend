import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgUserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgLeadAndClientList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/applicants/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgLeadAndClientList"],
    }),
    getOrgUserList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/organization/${organisationslug}/user-list/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgUserList"],
    }),
  }),
});

export const { useGetOrgLeadAndClientListQuery, useGetOrgUserListQuery } =
  OrgUserListApi;
