import { baseApi } from '@/Redux/Api/BaseApi';

export const OrgMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgMembers: builder.query({
      query: ({ organisationslug, params }) => ({
        url: `/api/organisations/${organisationslug}/members/`,
        method: 'GET',
        params: params,
      }),
      providesTags: ['OrgMembers'],
    }),

    updateOrgMember: builder.mutation({
      query: ({ organisationslug, memberAlias, payload }) => ({
        url: `/api/organisations/${organisationslug}/members/${memberAlias}/`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['OrgMembers'],
    }),

    deleteOrgMember: builder.mutation({
      query: ({ organisationslug, memberAlias }) => ({
        url: `/api/organisations/${organisationslug}/members/${memberAlias}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrgMembers'],
    }),
  }),
});

export const {
  useGetOrgMembersQuery,
  useUpdateOrgMemberMutation,
  useDeleteOrgMemberMutation,
} = OrgMembersApi;
