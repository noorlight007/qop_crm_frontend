import { baseApi } from "@/Redux/Api/BaseApi";

export const UserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (params) => ({
        url: `/filters/users/`,
        method: "GET",
        params,
      }),
      providesTags: ["AuthUserList"],
    }),
  }),
});
export const { useGetUserListQuery } = UserListApi;
