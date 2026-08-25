import { baseApi } from '@/Redux/Api/BaseApi';

export const NetworkMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkMembers: builder.query({
      query: ({ network_slug, params }) => ({
        url: `/api/networks/${network_slug}/members/`,
        method: 'GET',
        params: params,
      }),
      providesTags: ['NetworkMembers'],
    }),
    getNetworkMemberDetails: builder.query({
      query: ({ network_slug, member_alias }) => ({
        url: `/api/networks/${network_slug}/members/${member_alias}/`,
        method: 'GET',
      }),
      providesTags: ['NetworkMembers'],
    }),
    updateNetworkMember: builder.mutation({
      query: ({ network_slug, member_alias, payload }) => ({
        url: `/api/networks/${network_slug}/members/${member_alias}/`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['NetworkMembers'],
    }),
    deleteNetworkMember: builder.mutation({
      query: ({ network_slug, member_alias }) => ({
        url: `/api/networks/${network_slug}/members/${member_alias}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NetworkMembers'],
    }),
  }),
});
export const {
  useGetNetworkMembersQuery,
  useGetNetworkMemberDetailsQuery,
  useUpdateNetworkMemberMutation,
  useDeleteNetworkMemberMutation,
} = NetworkMembersApi;
