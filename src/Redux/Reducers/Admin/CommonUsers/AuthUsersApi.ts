import { baseApi } from "@/Redux/Api/BaseApi";

export const AuthUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthUsers: builder.query({
      query: (params) => ({
        url: "/auth/admin/user-list/",
        method: "GET",
        params,
      }),
      providesTags: ["AuthUsers"],
    }),
    updateAuthUserDetails: builder.mutation({
      query: ({ payload, userAlias }) => ({
        url: `/auth/admin/user-list/${userAlias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AuthUsers"],
    }),
    getNetworkList: builder.query({
      query: () => ({
        url: "/filters/networks/",
        method: "GET",
      }),
      providesTags: ["AuthUsers"],
    }),
    getOrganisationList: builder.query({
      query: (params) => ({
        url: "/filters/organisations/",
        method: "GET",
        params,
      }),
      providesTags: ["AuthUsers"],
    }),
    
  }),
});
export const {
  useGetAuthUsersQuery,
  useUpdateAuthUserDetailsMutation,
  useGetNetworkListQuery,
  useGetOrganisationListQuery,
} = AuthUsersApi;
