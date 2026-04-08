import { baseApi } from "@/Redux/Api/BaseApi";

export const LeadsOrApplicantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadsOrApplicants: builder.query({
      query: (params) => ({
        url: "/auth/admin/user-list/",
        method: "GET",
        params,
      }),
      providesTags: ["LeadsOrApplicants"],
    }),
    updateLeadsOrApplicantsDetails: builder.mutation({
      query: ({ payload, user_alias }) => ({
        url: `/auth/admin/user-list/${user_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["LeadsOrApplicants"],
    }),
    deleteLeadsOrApplicants: builder.mutation({
      query: ({ user_alias }) => ({
        url: `/auth/admin/user-list/${user_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeadsOrApplicants"],
    }),
  }),
});
export const {
  useGetLeadsOrApplicantsQuery,
  useUpdateLeadsOrApplicantsDetailsMutation,
  useDeleteLeadsOrApplicantsMutation,
} = LeadsOrApplicantsApi;
