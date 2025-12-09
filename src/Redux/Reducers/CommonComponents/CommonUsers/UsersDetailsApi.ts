import { baseApi } from "@/Redux/Api/BaseApi";

export const UsersDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `/director/users/`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = UsersDetailsApi;
