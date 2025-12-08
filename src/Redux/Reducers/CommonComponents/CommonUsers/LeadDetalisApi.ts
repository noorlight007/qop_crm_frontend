import { baseApi } from "@/Redux/Api/BaseApi";

export const LeadDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadDetails: builder.query({
      // Accepts an optional params object: { page, page_size, search, ... }
      query: (params) => ({
        url: `/director/leads/`,
        method: "GET",
        params: params || {},
      }),
      providesTags: ["LeadDetails"],
    }),
    addLeadDetails: builder.mutation({
      query: ({ payload }) => ({
        url: `/director/leads/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LeadDetails"],
    }),
    updateLeadDetails: builder.mutation({
      query: ({ leadAlias, payload }) => ({
        url: `/director/leads/${leadAlias}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["LeadDetails"],
    }),
    deleteLeadDetails: builder.mutation({
      query: ({ leadAlias }) => ({
        url: `/director/leads/${leadAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeadDetails"],
    }),
  }),
});

export const {
  useGetLeadDetailsQuery,
  useAddLeadDetailsMutation,
  useUpdateLeadDetailsMutation,
  useDeleteLeadDetailsMutation,
} = LeadDetailsApi;
