import { baseApi } from "@/Redux/Api/BaseApi";

export const LeadsOrApplicantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadsOrApplicants: builder.query({
      query: (params) => ({
        url: "/api/customers/",
        method: "GET",
        params,
      }),
      providesTags: ["LeadsOrApplicants"],
    }),
    addLeadsOrApplicants: builder.mutation({
      query: ({ payload }) => ({
        url: "/api/customers/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LeadsOrApplicants"],
    }),
    updateLeadsOrApplicantsDetails: builder.mutation({
      query: ({ payload, customerAlias }) => ({
        url: `/api/customers/${customerAlias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["LeadsOrApplicants"],
    }),
    deleteLeadsOrApplicants: builder.mutation({
      query: ({ customerAlias }) => ({
        url: `/api/customers/${customerAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeadsOrApplicants"],
    }),
  }),
});
export const {
  useGetLeadsOrApplicantsQuery,
  useAddLeadsOrApplicantsMutation,
  useUpdateLeadsOrApplicantsDetailsMutation,
  useDeleteLeadsOrApplicantsMutation,
} = LeadsOrApplicantsApi;
