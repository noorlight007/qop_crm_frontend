import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworkApplicantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewNetworkApplicant: builder.mutation({
      query: ({ network_slug, payload }) => ({
        url: `/api/networks/${network_slug}/applicants/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NetworkApplicants"],
    }),
    getNetworkApplicantList: builder.query({
      query: ({ network_slug, params }) => ({
        url: `/api/networks/${network_slug}/applicants/`,
        method: "GET",
        params,
      }),
      providesTags: ["NetworkApplicants"],
    }),
    updateNetworkApplicant: builder.mutation({
      query: ({ network_slug, user_alias, payload }) => ({
        url: `/api/networks/${network_slug}/applicants/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["NetworkApplicants"],
    }),
    deleteNetworkApplicant: builder.mutation({
      query: ({ network_slug, user_alias }) => ({
        url: `/api/networks/${network_slug}/applicants/${user_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkApplicants"],
    }),
  }),
});
export const {
  useAddNewNetworkApplicantMutation,
  useGetNetworkApplicantListQuery,
  useUpdateNetworkApplicantMutation,
  useDeleteNetworkApplicantMutation,
} = NetworkApplicantsApi;
