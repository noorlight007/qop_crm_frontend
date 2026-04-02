import { baseApi } from "@/Redux/Api/BaseApi";

export const UserFiltersListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (params) => ({
        url: `/filters/users/`,
        method: "GET",
        params,
      }),
      providesTags: ["AuthUserList"],
    }),
    leadOrClientFilterList: builder.query({
      query: (params) => ({
        url: `/filters/customers/`,
        method: "GET",
        params,
      }),
      providesTags: ["LeadOrClientFilterList"],
    }),
  }),
});
export const { useGetUserListQuery, useLeadOrClientFilterListQuery } =
  UserFiltersListApi;
