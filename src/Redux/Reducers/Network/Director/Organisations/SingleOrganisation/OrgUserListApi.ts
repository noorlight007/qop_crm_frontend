import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgUserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetOrgUserListQuery } = OrgUserListApi;
