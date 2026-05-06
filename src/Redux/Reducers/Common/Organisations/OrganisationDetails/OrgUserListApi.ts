import { baseApi } from "@/Redux/Api/BaseApi";

export const OrgUserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgUserList: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/api/organisations/${organisationslug}/members/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["OrgUserList"],
    }),

    updateOrgUser: builder.mutation({
      query: ({ organisationslug, user_alias, payload }) => ({
        url: `/api/organisations/${organisationslug}/members/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["OrgUserList"],
    }),

    deleteOrgUser: builder.mutation({
      query: ({ organisationslug, user_alias }) => ({
        url: `/api/organisations/${organisationslug}/members/${user_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgUserList"],
    }),
  }),
});

export const {
  useGetOrgUserListQuery,
  useUpdateOrgUserMutation,
  useDeleteOrgUserMutation,
} = OrgUserListApi;
