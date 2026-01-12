import { baseApi } from "@/Redux/Api/BaseApi";

export const UserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (params) => ({
        url: `/auth/user-filter-list/`,
        method: "GET",
        params,
      }),
      providesTags: ["AuthUserList"],
    }),
  }),
});
export const { useGetUserListQuery } = UserListApi;
