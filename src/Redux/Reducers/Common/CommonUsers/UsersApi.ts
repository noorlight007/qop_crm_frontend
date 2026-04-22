import { baseApi } from "@/Redux/Api/BaseApi";

export const UsersDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: `/director/users/`,
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = UsersDetailsApi;
