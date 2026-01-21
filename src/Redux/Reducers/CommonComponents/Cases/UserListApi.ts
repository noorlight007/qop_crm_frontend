import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const UserListApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (params) => ({
        url: `/public/users/`,
        method: "GET",
        params,
      }),
      providesTags: ["AuthUserList"],
    }),
  }),
});
export const { useGetUserListQuery } = UserListApi;
