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
      query: ({ payload, user_alias }) => ({
        url: `/auth/admin/user-list/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AuthUsers"],
    }),
    deleteAuthUser: builder.mutation({
       query: ({ user_alias }) => ({
        url: `/auth/admin/user-list/${user_alias}/`,
        method: "DELETE",
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
  useDeleteAuthUserMutation,
  useGetNetworkListQuery,
  useGetOrganisationListQuery,
} = AuthUsersApi;
